import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

export default function AuthCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<string>("로그인 처리 중...");

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const code = searchParams.get("code");
        const error = searchParams.get("error");

        // 에러가 있으면 로그인 페이지로 리다이렉트
        if (error) {
          console.error("구글 로그인 에러:", error);
          setStatus("로그인 실패. 로그인 페이지로 이동합니다...");
          setTimeout(() => {
            navigate("/login");
          }, 2000);
          return;
        }

        // code가 없으면 로그인 페이지로 리다이렉트
        if (!code) {
          console.error("code 파라미터가 없습니다.");
          setStatus(
            "로그인 코드를 받을 수 없습니다. 로그인 페이지로 이동합니다..."
          );
          setTimeout(() => {
            navigate("/login");
          }, 2000);
          return;
        }

        console.log("받은 code:", code);

        // 백엔드 URL 결정 (로컬/프로덕션)
        const isLocal =
          window.location.hostname === "localhost" ||
          window.location.hostname === "127.0.0.1";
        const backendUrl = isLocal
          ? "https://oliver-api-staging.thnos.app"
          : "https://oliver-api.thnos.app";

        // 3) 백엔드서버도메인/v1/auth/google/callback?code=코드값 으로 GET 요청
        const callbackUrl = `${backendUrl}/v1/auth/google/callback?code=${encodeURIComponent(code)}`;
        console.log("콜백 요청 URL:", callbackUrl);

        setStatus("백엔드에 인증 요청 중...");

        // GET 요청 보내기 (쿠키를 주고받기 위해 credentials: 'include' 사용)
        const response = await fetch(callbackUrl, {
          method: "GET",
          credentials: "include", // 쿠키를 주고받기 위해 필수
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(
            errorData.message || `HTTP error! status: ${response.status}`
          );
        }

        console.log("구글 로그인 성공!");
        setStatus("로그인 성공! 메인 페이지로 이동합니다...");

        // 메인 페이지로 리다이렉트
        setTimeout(() => {
          navigate("/", { replace: true });
        }, 1000);
      } catch (error: any) {
        console.error("구글 로그인 콜백 에러:", error);
        setStatus(
          `로그인 실패: ${error.message || "알 수 없는 오류가 발생했습니다."}`
        );
        setTimeout(() => {
          navigate("/login");
        }, 3000);
      }
    };

    const getUserInfo = async () => {
      //잠깐 기다리기
      await new Promise((resolve) => setTimeout(resolve, 200));

      const isLocal =
        window.location.hostname === "localhost" ||
        window.location.hostname === "127.0.0.1";
      const backendUrl = isLocal
        ? "https://oliver-api-staging.thnos.app"
        : "https://oliver-api.thnos.app";

      const meUrl = `${backendUrl}/v1/auth/@me`;

      const meResponse = await fetch(meUrl, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      console.log("사용자 정보 응답 상태:", meResponse.status, meResponse.ok);

      if (!meResponse.ok) {
        const errorData = await meResponse.json().catch(() => ({}));
        console.error("사용자 정보 조회 실패:", errorData);
        throw new Error(
          errorData.message || `HTTP error! status: ${meResponse.status}`
        );
      }

      const userData = await meResponse.json();
      console.log("사용자 정보:", userData);
    };

    handleCallback();
    getUserInfo();
  }, [searchParams, navigate]);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        fontSize: "16px",
        color: "#666",
        flexDirection: "column",
        gap: "10px",
      }}
    >
      <div>{status}</div>
    </div>
  );
}
