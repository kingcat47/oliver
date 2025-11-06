import axios from "axios";

let tokenCache: string | null = null;
let cacheTimestamp = 0;
const CACHE_DURATION = 100;

const getCookie = (name: string): string | null => {
  const cookies = document.cookie.split(';');
  for (let i = 0; i < cookies.length; i++) {
    const cookie = cookies[i].trim();
    if (cookie.startsWith(`${name}=`)) {
      return cookie.substring(name.length + 1);
    }
  }
  return null;
};

const getToken = (): string | null => {
  const now = Date.now();
  if (now - cacheTimestamp < CACHE_DURATION && tokenCache) {
    return tokenCache;
  }
  
  const token = getCookie("accessToken");
  
  tokenCache = token;
  cacheTimestamp = now;
  
  return token;
};

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "https://oliver-api.thnos.app",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

apiClient.interceptors.request.use(
  (config) => {
    const token = getToken();
    console.log("=== API Request ===");
    console.log("URL:", config.url);
    console.log("Method:", config.method?.toUpperCase());
    console.log("Token:", token ? `${token.substring(0, 20)}...` : "없음");
    console.log("Full Token:", token);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default apiClient;


