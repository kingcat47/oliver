import s from "./style.module.scss";

interface Props {
  children: React.ReactNode;
}

export default function MainLayout({ children }: Props) {
  return <main className={s.main}>{children}</main>;
}
