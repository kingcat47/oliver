import { useState, useEffect, useRef } from "react";
import s from "./styles.module.scss";
import MainLayout from "@/shared/components/main-layout";
import CameraViewer from "@/components/page/emergency/camera-viewer";
import DeviceLog from "@/components/page/emergency/device-log";
import FireDeclaration from "@/components/page/emergency/fire-declaration";
import MapArea from "@/components/page/map/maparea";
import { getDashboardFloorDevices } from "@/api/bot/service";
import { getBuildingFloors, getAllBuildings } from "@/api/building/service";
import { getBuildingFloorMap } from "@/api/map/service";

// PGM 파일을 PNG로 변환하는 함수 (has-map에서 사용하는 것과 동일)
const convertPgmToPng = async (pgmUrl: string): Promise<string> => {
  try {
    const response = await fetch(pgmUrl);
    const arrayBuffer = await response.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);

    // PGM 헤더 파싱
    let offset = 0;
    let header = "";

    // P2 (ASCII) 또는 P5 (Binary) 확인
    while (offset < uint8Array.length && header.length < 10) {
      const char = String.fromCharCode(uint8Array[offset]);
      header += char;
      offset++;
      if (char === "\n" && header.length > 2) break;
    }

    // 헤더에서 매직 넘버 확인
    const magicNumber = header.trim().split(/\s+/)[0];
    const isAscii = magicNumber === "P2";
    const isBinary = magicNumber === "P5";

    if (!isAscii && !isBinary) {
      throw new Error(`지원하지 않는 PGM 형식: ${magicNumber}`);
    }

    console.log(
      "📊 [emergency] PGM 형식:",
      isAscii ? "ASCII (P2)" : "Binary (P5)"
    );

    // 헤더 파싱 (너비, 높이, 최대값)
    let width = 0;
    let height = 0;
    let maxValue = 255;

    if (isAscii) {
      // ASCII PGM 파싱
      const text = new TextDecoder().decode(uint8Array);
      const lines = text.split("\n");
      let lineIndex = 0;

      // 매직 넘버 건너뛰기
      while (
        lineIndex < lines.length &&
        (lines[lineIndex].trim().startsWith("#") ||
          lines[lineIndex].trim().startsWith("P"))
      ) {
        lineIndex++;
      }

      // 너비, 높이, 최대값 파싱
      const values: number[] = [];
      for (let i = lineIndex; i < lines.length && values.length < 3; i++) {
        const parts = lines[i].trim().split(/\s+/);
        for (const part of parts) {
          if (part && !part.startsWith("#")) {
            const num = parseInt(part, 10);
            if (!isNaN(num)) {
              values.push(num);
            }
          }
        }
      }

      width = values[0] || 0;
      height = values[1] || 0;
      maxValue = values[2] || 255;

      // ASCII 데이터 시작 위치 찾기
      let dataStart = 0;
      let valueCount = 0;
      for (let i = 0; i < text.length; i++) {
        if (text[i] === "\n" || text[i] === " ") {
          const num = parseInt(text.substring(dataStart, i).trim(), 10);
          if (!isNaN(num)) {
            valueCount++;
            if (valueCount === 3) {
              offset = i + 1;
              break;
            }
          }
          dataStart = i + 1;
        }
      }
    } else {
      // Binary PGM 파싱
      let headerEnd = 0;
      let newlineCount = 0;

      // 헤더는 보통 3-4줄 (P5, width, height, maxValue)
      for (let i = 0; i < Math.min(1000, uint8Array.length); i++) {
        if (uint8Array[i] === 0x0a) {
          // \n
          newlineCount++;
          if (newlineCount >= 3) {
            headerEnd = i + 1;
            break;
          }
        }
      }

      // 헤더 텍스트 파싱
      const headerText = new TextDecoder().decode(
        uint8Array.slice(0, headerEnd)
      );
      const lines = headerText.split("\n");
      const values: number[] = [];

      for (const line of lines) {
        const trimmed = line.trim();
        if (trimmed && !trimmed.startsWith("#") && !trimmed.startsWith("P")) {
          const parts = trimmed.split(/\s+/);
          for (const part of parts) {
            const num = parseInt(part, 10);
            if (!isNaN(num)) {
              values.push(num);
            }
          }
        }
      }

      width = values[0] || 0;
      height = values[1] || 0;
      maxValue = values[2] || 255;

      offset = headerEnd;
    }

    console.log(
      "📊 [emergency] PGM 크기:",
      width,
      "x",
      height,
      ", 최대값:",
      maxValue
    );

    if (width === 0 || height === 0) {
      throw new Error("PGM 크기를 파싱할 수 없습니다");
    }

    // Canvas 생성
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");

    if (!ctx) {
      throw new Error("Canvas 컨텍스트를 가져올 수 없습니다");
    }

    // ImageData 생성
    const imageData = ctx.createImageData(width, height);
    const data = imageData.data;

    // PGM 데이터를 ImageData로 변환
    if (isAscii) {
      // ASCII PGM
      const text = new TextDecoder().decode(uint8Array);
      const textData = text.substring(offset).trim().split(/\s+/);
      for (let i = 0; i < textData.length && i < width * height; i++) {
        const gray = parseInt(textData[i], 10);
        const normalized = Math.floor((gray / maxValue) * 255);
        const index = i * 4;
        data[index] = normalized; // R
        data[index + 1] = normalized; // G
        data[index + 2] = normalized; // B
        data[index + 3] = 255; // A
      }
    } else {
      // Binary PGM
      const pixelCount = width * height;
      const bytesPerPixel = maxValue > 255 ? 2 : 1;

      for (
        let i = 0;
        i < pixelCount && offset + i * bytesPerPixel < uint8Array.length;
        i++
      ) {
        let gray = 0;
        if (bytesPerPixel === 1) {
          gray = uint8Array[offset + i];
        } else {
          gray =
            (uint8Array[offset + i * 2] << 8) | uint8Array[offset + i * 2 + 1];
        }

        const normalized = Math.floor((gray / maxValue) * 255);
        const index = i * 4;
        data[index] = normalized; // R
        data[index + 1] = normalized; // G
        data[index + 2] = normalized; // B
        data[index + 3] = 255; // A
      }
    }

    // Canvas에 그리기
    ctx.putImageData(imageData, 0, 0);

    // PNG로 변환
    return new Promise((resolve, reject) => {
      canvas.toBlob((blob) => {
        if (!blob) {
          reject(new Error("PNG 변환 실패"));
          return;
        }

        const pngUrl = URL.createObjectURL(blob);
        console.log("✅ [emergency] PGM → PNG 변환 완료:", pngUrl);
        resolve(pngUrl);
      }, "image/png");
    });
  } catch (error) {
    console.error("❌ [emergency] PGM 변환 실패:", error);
    throw error;
  }
};

// API baseURL 가져오기
const getApiBaseURL = () => {
  const isLocal =
    typeof window !== "undefined" &&
    (window.location.hostname === "localhost" ||
      window.location.hostname === "127.0.0.1");
  return isLocal
    ? "https://oliver-api-staging.thnos.app"
    : "https://oliver-api.thnos.app";
};

export default function Emergency() {
  const [zoomLevel, setZoomLevel] = useState(100);
  const [mapOffset, setMapOffset] = useState({ x: 0, y: 0 });
  const [currentMapUrl, setCurrentMapUrl] = useState<string>(
    "/sample/mpas/my_map.png"
  );
  const [isMapLoading, setIsMapLoading] = useState(false);
  const [buildingId, setBuildingId] = useState<string>("");
  const [floorId, setFloorId] = useState<string>("");
  const [placedDevices, setPlacedDevices] = useState<
    Array<{
      id: string;
      deviceId?: string;
      name: string;
      type: "robot" | "sensor";
      x: number;
      y: number;
    }>
  >([]);
  const previousBlobUrlRef = useRef<string | null>(null);

  // 건물 및 층 정보 가져오기
  useEffect(() => {
    const fetchBuildingAndFloor = async () => {
      try {
        const buildingsResponse = await getAllBuildings();
        if (buildingsResponse.data.length > 0) {
          const building = buildingsResponse.data[0];
          setBuildingId(building.id);

          const floorsResponse = await getBuildingFloors();
          if (floorsResponse.data.length > 0) {
            setFloorId(floorsResponse.data[0].id);
          }
        }
      } catch (error) {
        console.error("건물/층 정보 가져오기 실패:", error);
      }
    };
    fetchBuildingAndFloor();
  }, []);

  // 맵 이미지 가져오기
  useEffect(() => {
    const fetchMap = async () => {
      if (!buildingId || !floorId) return;

      try {
        setIsMapLoading(true);
        const mapResponse = await getBuildingFloorMap(buildingId, floorId);
        const mapPgmUrl = mapResponse.data?.mapPgmUrl;

        if (mapPgmUrl && mapPgmUrl.trim() !== "") {
          let finalUrl = mapPgmUrl.trim();
          const baseURL = getApiBaseURL();

          if (
            !finalUrl.startsWith("http://") &&
            !finalUrl.startsWith("https://")
          ) {
            finalUrl = `${baseURL}${finalUrl.startsWith("/") ? "" : "/"}${finalUrl}`;
          }

          if (finalUrl.toLowerCase().endsWith(".pgm")) {
            try {
              if (previousBlobUrlRef.current) {
                URL.revokeObjectURL(previousBlobUrlRef.current);
              }
              const pngUrl = await convertPgmToPng(finalUrl);
              previousBlobUrlRef.current = pngUrl;
              setCurrentMapUrl(pngUrl);
            } catch (error) {
              console.error("PGM 변환 실패:", error);
              setCurrentMapUrl(finalUrl);
            }
          } else {
            if (previousBlobUrlRef.current) {
              URL.revokeObjectURL(previousBlobUrlRef.current);
              previousBlobUrlRef.current = null;
            }
            setCurrentMapUrl(finalUrl);
          }
        } else {
          setCurrentMapUrl("/sample/mpas/my_map.png");
        }
      } catch (error) {
        console.error("맵 이미지 가져오기 실패:", error);
        setCurrentMapUrl("/sample/mpas/my_map.png");
      } finally {
        setIsMapLoading(false);
      }
    };

    fetchMap();

    return () => {
      if (previousBlobUrlRef.current) {
        URL.revokeObjectURL(previousBlobUrlRef.current);
        previousBlobUrlRef.current = null;
      }
    };
  }, [buildingId, floorId]);

  // 디바이스 목록 가져오기 (x, y 좌표 포함)
  useEffect(() => {
    const fetchDevices = async () => {
      if (!buildingId || !floorId) return;

      try {
        const dashboardResponse = await getDashboardFloorDevices(
          buildingId,
          floorId
        );
        const devices = dashboardResponse.data.map((device) => ({
          id: device.robotId.toString(),
          deviceId: device.robotId.toString(),
          name: device.name,
          type: device.type,
          x: device.location?.x || 0,
          y: device.location?.y || 0,
        }));
        setPlacedDevices(devices);
      } catch (error) {
        console.error("디바이스 목록 가져오기 실패:", error);
      }
    };

    fetchDevices();
  }, [buildingId, floorId]);

  return (
    <MainLayout hideSubHeader>
      <div className={s.container}>
        <div className={s.main_section}>
          <div className={s.content}>
            <p className={s.description}>현재 상황</p>
            <h1 className={s.title}>초기 진압 시도 중</h1>
          </div>

          <div className={s.map_section}>
            <p className={s.sub_description}>지도</p>
            <div className={s.map_container}>
              {isMapLoading ? (
                <div
                  style={{
                    padding: "40px",
                    textAlign: "center",
                    color: "#8B8B8B",
                    height: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  로딩 중...
                </div>
              ) : (
                <MapArea
                  mapImageUrl={currentMapUrl}
                  zoomLevel={zoomLevel}
                  onZoomLevelChange={setZoomLevel}
                  placedDevices={placedDevices}
                  mapOffset={mapOffset}
                  onMapOffsetChange={setMapOffset}
                  showBorder={false}
                />
              )}
            </div>
          </div>

          <div className={s.camera_section}>
            <p className={s.sub_description}>로봇 카메라</p>
            <CameraViewer />
          </div>
        </div>

        <div className={s.sub_section}>
          <div className={s.fire_declaration_section}>
            <FireDeclaration />
          </div>

          <DeviceLog />
        </div>
      </div>
    </MainLayout>
  );
}
