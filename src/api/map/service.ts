import apiClient from "../client";

export interface MapResponse {
  status: number;
  message: string;
  responseAt: string;
  data: {
    buildingId: number;
    floorId: number;
    mapPgmUrl: string;
    mapYamlUrl: string;
  };
}

/**
 * 특정 건물의 특정 층의 맵 정보를 가져옵니다.
 * @param buildingId 건물 ID
 * @param floorId 층 ID
 * @returns 맵 정보 (mapPgmUrl, mapYamlUrl 포함)
 */
export const getBuildingFloorMap = async (
  buildingId: string,
  floorId: string
): Promise<MapResponse> => {
  const response = await apiClient.get<MapResponse>(
    `/v1/building/${buildingId}/${floorId}/map`
  );
  return response.data;
};
