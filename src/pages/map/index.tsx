import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getBuildingFloors } from "@/api";
import HasFloors from "./has-map";
import HasNotFloors from "./hasnot-map";

export default function Map() {
  const navigate = useNavigate();
  const [hasFloors, setHasFloors] = useState<boolean | null>(null); // null: 로딩중

  useEffect(() => {
    const checkFloors = async () => {
      try {
        // getBuildingFloors 내부에서 getAllBuildings를 호출하므로 파라미터 없이 호출
        const floorsResponse = await getBuildingFloors();

        // 층이 있는지 확인
        setHasFloors(floorsResponse.data.length > 0);
      } catch (error) {
        console.error("층 데이터 가져오기 실패:", error);
        setHasFloors(false);
      }
    };

    checkFloors();
  }, []);

  const handleAddBuilding = () => {
    navigate("/map/register/section1");
  };

  // 로딩 중일 때는 아무것도 렌더링하지 않거나 로딩 표시
  if (hasFloors === null) {
    return null; // 또는 로딩 컴포넌트
  }

  return (
    <>
      {hasFloors ? (
        <HasFloors />
      ) : (
        <HasNotFloors onAddBuilding={handleAddBuilding} />
      )}
    </>
  );
}
