import { apiClient } from "../client";

/**
 * 로그아웃
 */
export const logout = async (): Promise<void> => {
  await apiClient.post("/v1/auth/logout");
};
