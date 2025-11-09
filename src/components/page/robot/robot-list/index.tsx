import { useState } from "react";
import { Bot, Badge, Battery, MapPin, Calendar, Search } from "lucide-react";
import { Segment } from "@/shared/components";
import s from "./styles.module.scss";

export default function RobotList() {
  const [selectedSegment, setSelectedSegment] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className={s.container}>
      <div className={s.fillter_header}>
        <div className={s.filter}>
          <Segment
            items={[
              { label: "전체 리스트", value: "all" },
              { label: "소화로봇", value: "fire" },
              { label: "화재감지기", value: "fireDetector" },
            ]}
            selected={selectedSegment}
            onChange={setSelectedSegment}
            width={320}
            height={44}
          />
        </div>

        <div className={s.search}>
          <Search size={18} className={s.searchIcon} />
          <input
            type="text"
            placeholder="제품 검색하기"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={s.searchInput}
          />
        </div>
      </div>

      <div className={s.robotlist}>
        <div className={s.header}>
          <div className={s.headerCell} style={{ width: "300px" }}>
            <Bot size={20} className={s.icon} />
            <span className={s.headerText}>로봇</span>
          </div>
          <div className={s.headerCell} style={{ width: "180px" }}>
            <Badge size={20} className={s.icon} />
            <span className={s.headerText}>상태</span>
          </div>
          <div className={s.headerCell} style={{ width: "200px" }}>
            <Battery size={20} className={s.icon} />
            <span className={s.headerText}>배터리</span>
          </div>
          <div className={s.headerCell} style={{ width: "200px" }}>
            <MapPin size={20} className={s.icon} />
            <span className={s.headerText}>로봇 위치</span>
          </div>
          <div className={s.headerCell} style={{ width: "265px" }}>
            <Calendar size={20} className={s.icon} />
            <span className={s.headerText}>등록 일자</span>
          </div>
        </div>

        <div className={s.items}></div>
      </div>
    </div>
  );
}
