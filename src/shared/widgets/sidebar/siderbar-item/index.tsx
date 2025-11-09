import { LucideIcon } from "lucide-react";
import { Link } from "react-router-dom";

import s from "./styles.module.scss";

interface Props {
  icon: LucideIcon;
  text: string;
  href: string;
  isActive: boolean;
}

export default function SidebarItem({
  icon: Icon,
  text,
  href,
  isActive,
}: Props) {
  return (
    <li className={s.item} data-active={isActive}>
      <Link to={href} className={s.link}>
        <Icon className={s.icon} />
        <span className={s.text}>{text}</span>
      </Link>
    </li>
  );
}
