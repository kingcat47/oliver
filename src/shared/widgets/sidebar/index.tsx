import { Box, ChartPie, Layers2, RefreshCcw, Video } from "lucide-react";
import { useLocation } from "react-router-dom";

import s from "./style.module.scss";

export default function Sidebar() {
  const pathname = useLocation().pathname;

  const isActive = (path: string) => pathname.includes(path);

  return (
    <aside className={s.sidebar}>
      <ul className={s.menu}>
        <li data-active={pathname === "/"}>
          <a href="/">
            <ChartPie />
          </a>
        </li>
        <li data-active={isActive("/devices")}>
          <a href="/devices">
            <Box />
          </a>
        </li>
        <li data-active={isActive("/camera")}>
          <a href="/camera">
            <Video />
          </a>
        </li>
        <li data-active={isActive("/check-update")}>
          <a href="/check-update">
            <RefreshCcw />
          </a>
        </li>
        <div className={s.full} />
        <li data-active={isActive("/reports")}>
          <a href="/reports">
            <Layers2 />
          </a>
        </li>
      </ul>
    </aside>
  );
}
