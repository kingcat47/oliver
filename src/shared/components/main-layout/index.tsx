import { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

import { SubHeader } from "@/shared/components";
import { Header, Sidebar } from "@/shared/widgets";

import s from "./style.module.scss";

interface Props {
  children: React.ReactNode;
  row?: boolean;
  backgroundVariant?: "default" | "gray";
  hideSubHeader?: boolean;
  hideOverflow?: boolean;
}

const SIDEBAR_STORAGE_KEY = "sidebar-open";

export default function MainLayout({
  children,
  row = false,
  backgroundVariant = "default",
  hideSubHeader = false,
  hideOverflow = false,
}: Props) {
  const location = useLocation();

  // 항상 닫힌 상태로 시작
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const prevPathnameRef = useRef(location.pathname);

  // 페이지 이동 시에만 사이드바 닫기 (초기 렌더링 제외)
  useEffect(() => {
    if (prevPathnameRef.current !== location.pathname) {
      setIsSidebarOpen(false);
      localStorage.setItem(SIDEBAR_STORAGE_KEY, "false");
      prevPathnameRef.current = location.pathname;
    }
  }, [location.pathname]);

  useEffect(() => {
    // 사이드바 상태가 변경될 때마다 localStorage에 저장
    localStorage.setItem(SIDEBAR_STORAGE_KEY, String(isSidebarOpen));
  }, [isSidebarOpen]);

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  return (
    <div className={s.layout}>
      <Header onMenuClick={toggleSidebar} />
      {!hideSubHeader && <SubHeader />}
      {isSidebarOpen && <div className={s.overlay} onClick={toggleSidebar} />}
      <Sidebar isOpen={isSidebarOpen} />
      <div className={s.container}>
        <main
          className={`${s.main} ${row ? s.row : ""} ${backgroundVariant === "gray" ? s.grayBackground : ""} ${hideOverflow ? s.noOverflow : ""}`}
        >
          {children}
        </main>
      </div>
    </div>
  );
}
