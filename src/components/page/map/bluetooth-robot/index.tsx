import { useState, useEffect, useRef } from "react";
import s from "./styles.module.scss";
import { ChevronDown } from "lucide-react";
import RobotItem from "./robot-item";
import { getBuildingFloorRobots } from "@/api/bot/service";
import { getAllBuildings } from "@/api/building/service";
import { DeviceType, DeviceDto } from "@/api/bot/dto/device";

interface Props {
  floorId?: string;
  selectedRobotId?: string | null;
  onRobotSelect?: (robotId: string) => void;
  onNoRobots?: () => void;
  showChevron?: boolean;
}

export default function BluetoothRobot({
  floorId,
  selectedRobotId,
  onRobotSelect,
  onNoRobots,
  showChevron = true,
}: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [robots, setRobots] = useState<DeviceDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedRobot, setSelectedRobot] = useState<DeviceDto | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // 로봇 목록 가져오기
  useEffect(() => {
    const fetchRobots = async () => {
      if (!floorId) return;

      try {
        setLoading(true);
        const buildingsResponse = await getAllBuildings();
        if (buildingsResponse.data.length === 0) {
          return;
        }
        const firstBuildingId = buildingsResponse.data[0].id;

        const floorRobots = await getBuildingFloorRobots(
          firstBuildingId,
          floorId
        );
        const robotDevices = floorRobots.filter(
          (device) => device.type === DeviceType.ROBOT
        );
        setRobots(robotDevices);

        // 로봇이 없으면 콜백 호출
        if (robotDevices.length === 0) {
          onNoRobots?.();
          return;
        }

        // 기본으로 첫 번째 로봇 선택 (항상)
        if (robotDevices.length > 0) {
          const firstRobot = robotDevices[0];
          console.log("기본 로봇 선택:", firstRobot.deviceId);
          setSelectedRobot(firstRobot);
          // onRobotSelect를 호출하여 부모 컴포넌트의 state 업데이트
          onRobotSelect?.(firstRobot.deviceId);
        }
      } catch (error) {
        console.error("로봇 목록 가져오기 실패:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRobots();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [floorId]);

  // selectedRobotId prop이 변경되면 해당 로봇 선택
  useEffect(() => {
    if (selectedRobotId && robots.length > 0) {
      const robot = robots.find((r) => r.deviceId === selectedRobotId);
      if (robot) {
        setSelectedRobot(robot);
      }
    }
  }, [selectedRobotId, robots]);

  // 외부 클릭 시 드롭다운 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleRobotSelect = (robot: DeviceDto) => {
    console.log("로봇 선택됨:", robot.deviceId);
    setSelectedRobot(robot);
    setIsOpen(false);
    onRobotSelect?.(robot.deviceId);
  };

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className={s.wrapper} ref={dropdownRef}>
      <div className={s.container} onClick={handleToggle}>
        {selectedRobot ? (
          <RobotItem
            name={selectedRobot.name}
            type="소화로봇"
            battery={selectedRobot.batteryLevel?.toString() || "0"}
          />
        ) : (
          <div className={s.placeholder}>
            {loading ? "로딩 중..." : "로봇을 선택하세요"}
          </div>
        )}
        {showChevron && (
          <ChevronDown
            size={24}
            className={`${s.chevron} ${isOpen ? s.chevronOpen : ""}`}
          />
        )}
      </div>

      {showChevron && isOpen && robots.length > 0 && (
        <div className={s.dropdown}>
          {robots.map((robot) => (
            <div
              key={robot.deviceId}
              className={`${s.dropdownItem} ${
                selectedRobot?.deviceId === robot.deviceId ? s.selected : ""
              }`}
              onClick={() => handleRobotSelect(robot)}
            >
              <RobotItem
                name={robot.name}
                type="소화로봇"
                battery={robot.batteryLevel?.toString() || "0"}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
