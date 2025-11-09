import { useState } from "react";
import { Layers2, ChevronDown } from "lucide-react";
import s from "./styles.module.scss";

interface Props {
  FloorName: string;
  onToggle?: (isOpen: boolean) => void;
}

export default function Filter({ FloorName, onToggle }: Props) {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = () => {
    const newIsOpen = !isOpen;
    setIsOpen(newIsOpen);
    onToggle?.(newIsOpen);
  };

  return (
    <div className={s.container}>
      <div className={s.header} onClick={handleToggle}>
        <Layers2 size={20} />
        <span>{FloorName}</span>
        <ChevronDown
          size={20}
          className={`${s.chevron} ${isOpen ? s.chevronOpen : ""}`}
        />
      </div>
    </div>
  );
}
