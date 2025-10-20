import cn from "classnames";

import s from "./style.module.scss";

interface SegmentItem {
  label: string;
  value: string;
}

interface Props {
  items: SegmentItem[];
  selected: string;
  onChange: (value: string) => void;
}

export default function Segment({ items, selected, onChange }: Props) {
  return (
    <div className={s.segment}>
      {items.map((item) => (
        <button
          key={item.value}
          onClick={() => onChange(item.value)}
          className={cn(s.item, selected === item.value && s.selected)}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
}
