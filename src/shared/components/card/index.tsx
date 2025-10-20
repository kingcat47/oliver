import cls from "classnames";

import s from "./style.module.scss";

interface Props {
  children: React.ReactNode;
  className?: string;
}

export default function Card({ children, className }: Props) {
  return <article className={cls(s.card, className)}>{children}</article>;
}

function Title({ children }: Pick<Props, "children">) {
  return <h3 className={s.title}>{children}</h3>;
}

Card.Title = Title;
