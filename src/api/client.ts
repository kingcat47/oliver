import axios from "axios";

// API 클라이언트 인스턴스 생성
export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "https://oliver-api.thnos.app",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // 쿠키를 주고받기 위해 필요
});

// 요청 인터셉터 (인증 토큰 추가 등)
apiClient.interceptors.request.use(
  (config) => {
    // 백엔드가 쿠키를 사용하므로, Authorization 헤더는 선택적
    // 만약 백엔드가 Authorization 헤더도 지원한다면 아래 코드를 활성화
    // const token = localStorage.getItem("token");
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 응답 인터셉터 (에러 처리 등)
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // 401 에러 시 로그인 페이지로 리다이렉트
    // 단, ProtectedRoute에서 인증 확인 중일 때는 리다이렉트하지 않음
    if (error.response?.status === 401) {
      const currentPath = window.location.pathname;
      // 로그인 관련 페이지가 아니고, ProtectedRoute가 처리할 수 있도록 함
      // ProtectedRoute에서 이미 인증 실패 시 리다이렉트를 처리하므로
      // 여기서는 리다이렉트하지 않고 에러만 전달
      if (currentPath !== "/login" && 
          currentPath !== "/auth/callback" &&
          currentPath !== "/auth/success") {
        // ProtectedRoute가 처리하도록 에러만 전달
        console.log("401 에러 발생, ProtectedRoute가 처리할 예정");
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;


