import { useState, useEffect } from "react";

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
  // localStorage에서 사이드바 상태 가져오기 (기본값: true)
  const [isSidebarOpen, setIsSidebarOpen] = useState(() => {
    const saved = localStorage.getItem(SIDEBAR_STORAGE_KEY);
    return saved !== null ? saved === "true" : true;
  });

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
      <div className={s.container}>
        <main
          className={`${s.main} ${row ? s.row : ""} ${backgroundVariant === "gray" ? s.grayBackground : ""} ${hideOverflow ? s.noOverflow : ""}`}
        >
          {children}
        </main>
        {isSidebarOpen && <div className={s.overlay} onClick={toggleSidebar} />}
        <Sidebar isOpen={isSidebarOpen} />
      </div>
    </div>
  );
}
