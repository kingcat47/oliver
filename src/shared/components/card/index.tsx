import cls from "classnames";

import s from "./style.module.scss";

interface Props {
  children: React.ReactNode;
  className?: string;
  padding?: boolean;
}

export default function Card({ children, className, padding = true }: Props) {
  return (
    <article className={cls(s.card, className, { [s.paddingOn]: padding })}>
      {children}
    </article>
  );
}

function Title({ children }: Pick<Props, "children">) {
  return <h3 className={s.title}>{children}</h3>;
}

Card.Title = Title;
