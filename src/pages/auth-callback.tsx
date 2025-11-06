import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import apiClient from "@/api/client";

export default function AuthCallback() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // URL에서 code나 token 파라미터 가져오기
        const code = searchParams.get("code");
        const token = searchParams.get("token");
        const error = searchParams.get("error");

        // 에러가 있으면 로그인 페이지로 리다이렉트
        if (error) {
          console.error("OAuth 에러:", error);
          navigate("/login");
          return;
        }

        // 토큰이 직접 전달된 경우
        if (token) {
          // 토큰을 로컬 스토리지에 저장
          localStorage.setItem("token", token);
          // 홈으로 리다이렉트
          navigate("/");
          return;
        }

        // code가 전달된 경우, 백엔드로 전송하여 토큰 받기
        if (code) {
          try {
            const response = await apiClient.post("/v1/auth/google/callback", {
              code,
            });
            
            if (response.data.token) {
              localStorage.setItem("token", response.data.token);
              navigate("/");
            } else {
              throw new Error("토큰을 받지 못했습니다.");
            }
          } catch (error) {
            console.error("토큰 교환 실패:", error);
            navigate("/login");
          }
          return;
        }

        // code나 token이 없으면 로그인 페이지로 리다이렉트
        navigate("/login");
      } catch (error) {
        console.error("Callback 처리 실패:", error);
        navigate("/login");
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

