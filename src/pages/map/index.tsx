import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllBuildings } from "@/api";
import HasFloors from "./has-map";
import HasNotFloors from "./hasnot-map";

export default function Map() {
  const navigate = useNavigate();
  const [hasBuildings, setHasBuildings] = useState<boolean | null>(null); // null: 로딩중

  useEffect(() => {
    const fetchBuildings = async () => {
      try {
        const response = await getAllBuildings();
        setHasBuildings(response.data.length > 0);
      } catch (error) {
        console.error("건물 데이터 가져오기 실패:", error);
        setHasBuildings(true);
      }
    };

    fetchBuildings();
  }, []);

  const handleAddBuilding = () => {
    navigate("/map/register/section1");
  };

  // 로딩 중일 때는 아무것도 렌더링하지 않거나 로딩 표시
  if (hasBuildings === null) {
    return null; // 또는 로딩 컴포넌트
  }

  return (
    <>
      {hasBuildings ? (
        <HasFloors />
      ) : (
        <HasNotFloors onAddBuilding={handleAddBuilding} />
      )}
    </>
  );
}
