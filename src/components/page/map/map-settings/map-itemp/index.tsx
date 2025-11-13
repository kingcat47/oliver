import { Layers2, Pencil, Trash2 } from "lucide-react";
import s from "./styles.module.scss";

interface MapItemProps {
  title: string;
  description: string;
}

export default function MapItem({ title, description }: MapItemProps) {
  return (
    <div className={s.container}>
      <div className={s.lead}>
        <div className={s.titleContainer}>
          <Layers2 size={24} />
          <h1 className={s.title}>{title}</h1>
        </div>

        <p className={s.description}>{description}</p>
      </div>

      <div className={s.tail}>
        <Pencil size={24} color="#8B8B8B" />
        <Trash2 size={24} color="#8B8B8B" />
      </div>
    </div>
  );
}
