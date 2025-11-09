import { Plus, Search, Settings } from "lucide-react";
import s from "./styles.module.scss";

export interface Floor {
  id: string;
  level: number;
  name: string;
}

interface FillterItemProps {
  floors?: Floor[];
  selectedFloorId?: string;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  onFloorSelect?: (floorId: string) => void;
  onAddFloor?: () => void;
  onManage?: () => void;
}

export default function FillterItem({
  floors = [],
  selectedFloorId,
  searchQuery = "",
  onSearchChange,
  onFloorSelect,
  onAddFloor,
  onManage,
}: FillterItemProps) {
  const filteredFloors = floors.filter((floor) =>
    floor.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className={s.container}>
      <div className={s.search}>
        <Search size={18} className={s.Icon} />
        <input
          type="text"
          placeholder="검색하기"
          className={s.searchInput}
          value={searchQuery}
          onChange={(e) => onSearchChange?.(e.target.value)}
        />
      </div>
      <div className={s.content}>
        {filteredFloors.map((floor) => (
          <div
            key={floor.id}
            className={`${s.floorItem} ${
              selectedFloorId === floor.id ? s.selected : ""
            }`}
            onClick={() => onFloorSelect?.(floor.id)}
          >
            <span className={s.floorName}>{floor.name}</span>
          </div>
        ))}
      </div>
      <div className={s.footer}>
        <button className={s.button} onClick={onAddFloor}>
          <Plus size={18} className={s.Icon} />
          <span className={s.buttonText}>공간 추가</span>
        </button>
        <button className={s.button} onClick={onManage}>
          <Settings size={18} className={s.Icon} />
          <span className={s.buttonText}>관리</span>
        </button>
      </div>
    </div>
  );
}
