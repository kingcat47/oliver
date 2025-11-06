import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import apiClient from "@/api/client";

export default function AuthCallback() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        console.log("=== Auth Callback 처리 시작 ===");
        console.log("현재 URL:", window.location.href);
        console.log("현재 경로:", window.location.pathname);
        console.log("전체 쿼리 파라미터:", Object.fromEntries(searchParams.entries()));
        
        // URL에서 code나 token 파라미터 가져오기
        const code = searchParams.get("code");
        const token = searchParams.get("token");
        const error = searchParams.get("error");

        console.log("추출된 파라미터:", { code: code ? "있음" : "없음", token: token ? "있음" : "없음", error });

        // 에러가 있으면 로그인 페이지로 리다이렉트
        if (error) {
          console.error("=== OAuth 에러 발생 ===");
          console.error("에러 내용:", error);
          console.error("에러 설명:", searchParams.get("error_description"));
          navigate("/login", { replace: true });
          return;
        }

        // 토큰이 직접 전달된 경우 (백엔드가 토큰을 쿼리 파라미터로 전달하는 경우)
        // 하지만 백엔드가 쿠키를 주입한다고 했으므로 이 경우는 거의 없을 것
        if (token) {
          console.log("토큰이 쿼리 파라미터로 전달됨:", token);
          // 백엔드가 쿠키를 주입한다고 했으므로, 토큰 저장은 선택적
          // 필요시에만 localStorage에 저장
          // localStorage.setItem("token", token);
          navigate("/", { replace: true });
          return;
        }

        // code가 전달된 경우, 백엔드로 GET 요청 (쿠키 주입)
        if (code) {
          try {
            console.log("=== Google OAuth code 처리 시작 ===");
            console.log("받은 code:", code.substring(0, 20) + "...");
            
            const backendUrl = import.meta.env.VITE_API_BASE_URL || "https://oliver-api.thnos.app";
            const callbackUrl = `${backendUrl}/v1/auth/google/callback?code=${encodeURIComponent(code)}`;
            console.log("백엔드 callback URL:", callbackUrl);
            
            // 백엔드로 GET 요청: /v1/auth/google/callback?code=코드값
            // 백엔드에서 쿠키를 자동으로 주입해줌
            console.log("백엔드로 요청 전송 중...");
            const response = await apiClient.get("/v1/auth/google/callback", {
              params: {
                code,
              },
            });
            
            console.log("=== 로그인 성공 ===");
            console.log("응답 상태:", response.status);
            console.log("응답 데이터:", response.data);
            console.log("응답 헤더:", response.headers);
            
            // 쿠키 확인
            console.log("현재 쿠키:", document.cookie);
            
            // 백엔드가 쿠키를 주입해주므로, 쿠키가 브라우저에 설정될 시간을 주기 위해 약간의 지연
            console.log("쿠키 주입 완료, 홈으로 리다이렉트");
            await new Promise(resolve => setTimeout(resolve, 300)); // 300ms 대기
            navigate("/", { replace: true });
          } catch (error: any) {
            console.error("=== 로그인 처리 실패 ===");
            console.error("에러 객체:", error);
            console.error("에러 상태:", error.response?.status);
            console.error("에러 데이터:", error.response?.data);
            console.error("에러 헤더:", error.response?.headers);
            console.error("에러 메시지:", error.message);
            
            // 네트워크 에러인지 확인
            if (!error.response) {
              console.error("네트워크 에러 또는 CORS 에러일 수 있습니다.");
            }
            
            navigate("/login", { replace: true });
          }
          return;
        }

        // code나 token이 없지만 /auth/success로 온 경우
        // 백엔드가 이미 쿠키를 주입하고 리다이렉트한 경우일 수 있음
        // 홈으로 리다이렉트 시도
        if (window.location.pathname === "/auth/success") {
          console.log("=== /auth/success 경로로 접근 ===");
          console.log("쿠키 확인:", document.cookie);
          navigate("/", { replace: true });
          return;
        }

        // 그 외의 경우 로그인 페이지로 리다이렉트
        console.warn("=== 예상치 못한 상황 ===");
        console.warn("code, token, error 모두 없음");
        console.warn("현재 URL:", window.location.href);
        navigate("/login", { replace: true });
      } catch (error) {
        console.error("Callback 처리 실패:", error);
        navigate("/login", { replace: true });
      }
    };

    handleCallback();
  }, [searchParams, navigate]);

  return (
    <div style={{ 
      display: "flex", 
      justifyContent: "center", 
      alignItems: "center", 
      height: "100vh",
      fontSize: "16px",
      color: "#666"
    }}>
      로그인 처리 중...
    </div>
  );
}

