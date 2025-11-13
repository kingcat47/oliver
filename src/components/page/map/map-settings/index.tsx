import { useState, useEffect } from "react";
import { X } from "lucide-react";
import s from "./styles.module.scss";
import MapItem from "./map-itemp";
import { getBuildingFloors } from "@/api/building/service";

interface MapSettingsProps {
  onClose?: () => void;
}

export default function MapSettings({ onClose }: MapSettingsProps) {
  const [floors, setFloors] = useState<
    Array<{ id: string; name: string; level: number }>
  >([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const floorsResponse = await getBuildingFloors();
        const floorsData = floorsResponse.data.map((floor) => ({
          id: floor.id,
          name: floor.name,
          level: floor.level,
        }));
        setFloors(floorsData);
      } catch (error) {
        console.error("층 정보 가져오기 실패:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className={s.overlay} onClick={onClose}>
      <div className={s.container} onClick={(e) => e.stopPropagation()}>
        <div className={s.header}>
          <h1 className={s.title}>공간 관리하기</h1>
          <button className={s.closeButton} onClick={onClose}>
            <X size={24} color="#8B8B8B" />
          </button>
        </div>
        <div className={s.content}>
          {loading ? (
            <div
              style={{ padding: "24px", textAlign: "center", color: "#8B8B8B" }}
            >
              로딩 중...
            </div>
          ) : (
            <>
              {floors.map((floor) => (
                <MapItem
                  key={floor.id}
                  title={floor.name}
                  description="경남 김해시 진영읍 봉하로 115 (본산리 40-2)"
                />
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
