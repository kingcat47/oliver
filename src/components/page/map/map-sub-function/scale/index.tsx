import { Minus, Plus } from "lucide-react";
import s from "./styles.module.scss";

interface Props {
  scale: number;
  onZoomIn?: () => void;
  onZoomOut?: () => void;
}

export default function Scale({ scale, onZoomIn, onZoomOut }: Props) {
  return (
    <div className={s.container}>
      <button className={s.button} onClick={onZoomOut}>
        <Minus size={20} />
      </button>
      <span className={s.scale}>{scale}%</span>
      <button className={s.button} onClick={onZoomIn}>
        <Plus size={20} />
      </button>
    </div>
  );
}
