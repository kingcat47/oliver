import s from "./styles.module.scss";
import { Checkbox } from "@/shared/components";

interface Props {
  title: string;
  description: string;
  image: string;
  selected: boolean;
  onSelect: () => void;
}

export default function RobotRegisterCard({
  title,
  description,
  image,
  selected,
  onSelect,
}: Props) {
  return (
    <div className={s.container} onClick={() => onSelect()}>
      <h1 className={s.title}>{title}</h1>
      <p className={s.description}>{description}</p>
      <div className={s.image}>
        <img src={image} alt={title} />
      </div>
      <div onClick={(e) => e.stopPropagation()}>
        <Checkbox
          checked={selected}
          onChange={(checked) => {
            // 체크박스가 선택된 상태에서 해제를 시도하면 무시
            if (!checked) {
              return;
            }
            onSelect();
          }}
        />
      </div>
    </div>
  );
}
