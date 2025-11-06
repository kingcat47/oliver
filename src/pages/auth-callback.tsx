import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import apiClient from "@/api/client";

// 로그를 localStorage에 저장하는 헬퍼 함수
const saveLog = (message: string, data?: any) => {
  const logs = JSON.parse(localStorage.getItem("auth_logs") || "[]");
  logs.push({
    time: new Date().toISOString(),
    message,
    data: data ? JSON.stringify(data, null, 2) : undefined,
  });
  // 최근 50개만 유지
  if (logs.length > 50) logs.shift();
  localStorage.setItem("auth_logs", JSON.stringify(logs));
  console.log(message, data);
};

export default function AuthCallback() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [debugInfo, setDebugInfo] = useState<string>("");

  useEffect(() => {
    const handleCallback = async () => {
      try {
        saveLog("=== Auth Callback 처리 시작 ===");
        saveLog("현재 URL", window.location.href);
        saveLog("현재 경로", window.location.pathname);
        saveLog("전체 쿼리 파라미터", Object.fromEntries(searchParams.entries()));
        
        // URL에서 code나 token 파라미터 가져오기
        const code = searchParams.get("code");
        const token = searchParams.get("token");
        const error = searchParams.get("error");

        saveLog("추출된 파라미터", { code: code ? "있음" : "없음", token: token ? "있음" : "없음", error });

        // 에러가 있으면 로그인 페이지로 리다이렉트
        if (error) {
          saveLog("=== OAuth 에러 발생 ===", { error, description: searchParams.get("error_description") });
          setDebugInfo(`에러: ${error}`);
          setTimeout(() => navigate("/login", { replace: true }), 3000);
          return;
        }

        // 토큰이 직접 전달된 경우 (백엔드가 토큰을 쿼리 파라미터로 전달하는 경우)
        // 하지만 백엔드가 쿠키를 주입한다고 했으므로 이 경우는 거의 없을 것
        if (token) {
          saveLog("토큰이 쿼리 파라미터로 전달됨", { token: token.substring(0, 20) + "..." });
          // 백엔드가 쿠키를 주입한다고 했으므로, 토큰 저장은 선택적
          // 필요시에만 localStorage에 저장
          // localStorage.setItem("token", token);
          navigate("/", { replace: true });
          return;
        }

        // code가 전달된 경우, 백엔드로 GET 요청 (쿠키 주입)
        if (code) {
          try {
            saveLog("=== Google OAuth code 처리 시작 ===");
            saveLog("받은 code", code.substring(0, 20) + "...");
            
            const backendUrl = import.meta.env.VITE_API_BASE_URL || "https://oliver-api.thnos.app";
            const callbackUrl = `${backendUrl}/v1/auth/google/callback?code=${encodeURIComponent(code)}`;
            saveLog("백엔드 callback URL", callbackUrl);
            
            // 백엔드로 GET 요청: /v1/auth/google/callback?code=코드값
            // 백엔드에서 쿠키를 자동으로 주입해줌
            saveLog("백엔드로 요청 전송 중...");
            setDebugInfo("백엔드로 요청 전송 중...");
            
            const response = await apiClient.get("/v1/auth/google/callback", {
              params: {
                code,
              },
            });
            
            saveLog("=== 로그인 성공 ===", {
              status: response.status,
              data: response.data,
              headers: Object.fromEntries(Object.entries(response.headers)),
            });
            
            // 쿠키 확인
            const cookies = document.cookie;
            saveLog("현재 쿠키", cookies);
            setDebugInfo(`로그인 성공! 쿠키: ${cookies || "없음"}`);
            
            // 쿠키가 없으면 문제가 있는 것
            if (!cookies || cookies.length === 0) {
              saveLog("⚠️ 경고: 쿠키가 설정되지 않았습니다!", {
                responseHeaders: Object.fromEntries(Object.entries(response.headers)),
              });
              setDebugInfo("⚠️ 쿠키가 설정되지 않았습니다! 5초 후 로그인 페이지로 이동합니다.");
              setTimeout(() => navigate("/login", { replace: true }), 5000);
              return;
            }
            
            // 백엔드가 쿠키를 주입해주므로, 쿠키가 브라우저에 설정될 시간을 주기 위해 약간의 지연
            saveLog("쿠키 주입 완료, 홈으로 리다이렉트");
            await new Promise(resolve => setTimeout(resolve, 500));
            navigate("/", { replace: true });
          } catch (error: any) {
            saveLog("=== 로그인 처리 실패 ===", {
              status: error.response?.status,
              data: error.response?.data,
              headers: error.response?.headers ? Object.fromEntries(Object.entries(error.response.headers)) : undefined,
              message: error.message,
              isNetworkError: !error.response,
            });
            
            const errorMsg = error.response 
              ? `에러 ${error.response.status}: ${JSON.stringify(error.response.data)}`
              : `네트워크 에러: ${error.message}`;
            setDebugInfo(`로그인 실패: ${errorMsg}`);
            
            // 네트워크 에러인지 확인
            if (!error.response) {
              saveLog("⚠️ 네트워크 에러 또는 CORS 에러일 수 있습니다.");
            }
            
            setTimeout(() => navigate("/login", { replace: true }), 5000);
          }
          return;
        }

        // code나 token이 없지만 /auth/success로 온 경우
        // 백엔드가 이미 쿠키를 주입하고 리다이렉트한 경우일 수 있음
        // 홈으로 리다이렉트 시도
        if (window.location.pathname === "/auth/success") {
          saveLog("=== /auth/success 경로로 접근 ===");
          saveLog("쿠키 확인", document.cookie);
          navigate("/", { replace: true });
          return;
        }

        // 그 외의 경우 로그인 페이지로 리다이렉트
        saveLog("=== 예상치 못한 상황 ===", {
          message: "code, token, error 모두 없음",
          url: window.location.href,
        });
        setDebugInfo("예상치 못한 상황: code, token, error 모두 없음");
        setTimeout(() => navigate("/login", { replace: true }), 3000);
      } catch (error: any) {
        saveLog("=== Callback 처리 실패 (예외) ===", {
          message: error.message,
          stack: error.stack,
        });
        setDebugInfo(`예외 발생: ${error.message}`);
        setTimeout(() => navigate("/login", { replace: true }), 3000);
      }
    };

    handleCallback();
  }, [searchParams, navigate]);

  return (
    <div style={{ 
      display: "flex", 
      flexDirection: "column",
      justifyContent: "center", 
      alignItems: "center", 
      height: "100vh",
      fontSize: "16px",
      color: "#666",
      padding: "20px",
      gap: "20px"
    }}>
      <div>로그인 처리 중...</div>
      {debugInfo && (
        <div style={{
          maxWidth: "600px",
          padding: "15px",
          backgroundColor: "#f5f5f5",
          borderRadius: "8px",
          fontSize: "14px",
          whiteSpace: "pre-wrap",
          wordBreak: "break-word"
        }}>
          {debugInfo}
        </div>
      )}
      <div style={{ fontSize: "12px", color: "#999", marginTop: "20px" }}>
        로그는 localStorage의 "auth_logs"에 저장됩니다.
        <br />
        개발자 도구 → Application → Local Storage에서 확인하세요.
      </div>
    </div>
  );
}

