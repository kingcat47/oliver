import { LucideIcon } from "lucide-react";
import s from "./styles.module.scss";

export type RobotStatus = "대기중" | "충전중" | "이동중" | "진화중";

interface RobotItemProps {
  image: string;
  name: string;
  type: string;
  status: RobotStatus;
  statusIcon: LucideIcon;
  battery: number;
  location: string;
  registeredDate: string;
  onClick?: () => void;
}

const statusStyles: Record<
  RobotStatus,
  { backgroundColor: string; textColor: string }
> = {
  대기중: { backgroundColor: "#EFF0F2", textColor: "#8B8B8B" },
  충전중: { backgroundColor: "#E9FFEC", textColor: "#48B842" },
  이동중: { backgroundColor: "#FFF9ED", textColor: "#FF9201" },
  진화중: { backgroundColor: "#FFF4F4", textColor: "#F03839" },
};

export default function RobotItem({
  image,
  name,
  type,
  status,
  statusIcon: StatusIcon,
  battery,
  location,
  registeredDate,
  onClick,
}: RobotItemProps) {
  const statusStyle = statusStyles[status];

  return (
    <div className={s.container} onClick={onClick}>
      {/* 로봇 정보 */}
      <div className={s.robotCell} style={{ width: "300px" }}>
        <img src={image} alt={name} className={s.robotImage} />
        <div className={s.robotInfo}>
          <p className={s.robotName}>{name}</p>
          <p className={s.robotType}>{type}</p>
        </div>
      </div>

      {/* 상태 */}
      <div className={s.statusCell} style={{ width: "180px" }}>
        <div
          className={s.statusBadge}
          style={{
            backgroundColor: statusStyle.backgroundColor,
          }}
        >
          <StatusIcon size={16} style={{ color: statusStyle.textColor }} />
          <span
            className={s.statusText}
            style={{ color: statusStyle.textColor }}
          >
            {status}
          </span>
        </div>
      </div>

      {/* 배터리 */}
      <div className={s.batteryCell} style={{ width: "200px" }}>
        <div className={s.batteryBar}>
          <div
            className={s.batteryFill}
            style={{
              width: `${battery}%`,
              backgroundColor:
                battery > 50 ? "#48B842" : battery > 20 ? "#FF9201" : "#F03839",
            }}
          />
        </div>
        <p
          className={s.batteryText}
          style={{
            color:
              battery > 50 ? "#48B842" : battery > 20 ? "#FF9201" : "#F03839",
          }}
        >
          {battery}%
        </p>
      </div>

      {/* 로봇 위치 */}
      <div className={s.locationCell} style={{ width: "200px" }}>
        <p className={s.locationText}>{location}</p>
      </div>

      {/* 등록 일자 */}
      <div className={s.dateCell} style={{ width: "265px" }}>
        <p className={s.dateText}>{registeredDate}</p>
      </div>
    </div>
  );
}
