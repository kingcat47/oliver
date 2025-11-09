import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllDevices } from "@/api";
import HasNotRobot from "./hasnot-robot/norobot";
import HasRobot from "./has-robot/isrobot";

export default function Robot() {
  const navigate = useNavigate();
  const [hasRobots, setHasRobots] = useState<boolean | null>(null); // null: 로딩중

  useEffect(() => {
    const fetchDevices = async () => {
      try {
        const devices = await getAllDevices();
        setHasRobots(devices.length > 0);
      } catch (error) {
        console.error("디바이스 데이터 가져오기 실패:", error);
        setHasRobots(false);
      }
    };

    fetchDevices();
  }, []);

  const handleAddRobot = () => {
    navigate("/robot/register/section1");
  };

  // 로딩 중일 때는 아무것도 렌더링하지 않거나 로딩 표시
  if (hasRobots === null) {
    return null; // 또는 로딩 컴포넌트
  }

  return (
    <>
      {hasRobots ? <HasRobot /> : <HasNotRobot onAddRobot={handleAddRobot} />}
    </>
  );
}
