import apiClient from "../client";

import {
  DeleteDeviceResponseDto,
  DeviceDto,
  RegisterRobotDto,
  RegisterSensorDto,
  RegisterSuccessResponseDto,
  UpdateDeviceDto,
  UpdateDeviceResponseDto,
} from "./dto/device";

// API 응답 래퍼 타입
interface ApiResponse<T> {
  status: number;
  message: string;
  responseAt: string;
  data: T;
}

/**
 * 모든 디바이스 조회
 */
export const getAllDevices = async (): Promise<DeviceDto[]> => {
  const response = await apiClient.get<ApiResponse<DeviceDto[]>>("/v1/device");
  return response.data.data;
};

/**
 * 디바이스 ID로 조회
 */
export const getDeviceById = async (deviceId: string): Promise<DeviceDto> => {
  const response = await apiClient.get<ApiResponse<DeviceDto>>(
    `/v1/device/${deviceId}`
  );
  return response.data.data;
};

/**
 * 디바이스 타입별 조회
 */
export const getDevicesByType = async (
  type: "robot" | "sensor"
): Promise<DeviceDto[]> => {
  const response = await apiClient.get<ApiResponse<DeviceDto[]>>(
    `/v1/device?type=${type}`
  );
  return response.data.data;
};

/**
 * 디바이스 업데이트
 */
export const updateDevice = async (
  deviceId: string,
  data: UpdateDeviceDto
): Promise<UpdateDeviceResponseDto> => {
  const response = await apiClient.patch<UpdateDeviceResponseDto>(
    `/devices/${deviceId}`,
    data
  );
  return response.data;
};

/**
 * 디바이스 삭제
 */
export const deleteDevice = async (
  deviceId: string
): Promise<DeleteDeviceResponseDto> => {
  const response = await apiClient.delete<DeleteDeviceResponseDto>(
    `/devices/${deviceId}`
  );
  return response.data;
};

/**
 * 로봇 등록
 * @param data - 로봇 등록에 필요한 정보 (id, buildingId, floorId, name)
 * @returns 등록된 디바이스 정보
 */
export const registerRobot = async (
  data: RegisterRobotDto
): Promise<DeviceDto> => {
  const response = await apiClient.post<ApiResponse<DeviceDto>>(
    "/v1/device/register/robot",
    data
  );
  return response.data.data;
};

/**
 * 센서 등록
 * @param data - 센서 등록에 필요한 정보 (id, buildingId, floorId, name, tuyaDeviceRegisterKey)
 * @returns 등록된 디바이스 정보
 */
export const registerSensor = async (
  data: RegisterSensorDto
): Promise<DeviceDto> => {
  const response = await apiClient.post<ApiResponse<DeviceDto>>(
    "/v1/device/register/sensor",
    data
  );
  return response.data.data;
};
