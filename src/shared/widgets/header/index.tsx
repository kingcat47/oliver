import { useState, useEffect, useRef } from "react";
import { Bell, Menu, User } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { IconButton } from "@/shared/components";
import { logout } from "@/api/auth/service";

import s from "./style.module.scss";

interface Props {
  leftContent?: React.ReactNode;
  rightContent?: React.ReactNode;
  onMenuClick?: () => void;
}

export default function Header({
  leftContent,
  rightContent,
  onMenuClick,
}: Props) {
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // 외부 클릭 시 드롭다운 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDropdownOpen]);

  const handleUserClick = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("로그아웃 실패:", error);
      alert("로그아웃에 실패했습니다.");
    }
  };

  return (
    <header className={s.header}>
      <div className={s.actions}>
        <IconButton
          icon={Menu}
          primary={false}
          onClick={onMenuClick || (() => {})}
        />
        <span className={s.title}>Oliver Dashboard</span>
        {leftContent}
      </div>
      <div className={s.actions}>
        {rightContent}

        <IconButton icon={Bell} primary={false} onClick={() => {}} />

        <div className={s.userContainer} ref={dropdownRef}>
          <button className={s.userButton} onClick={handleUserClick}>
            <User size={20} />
          </button>
          {isDropdownOpen && (
            <div className={s.dropdown}>
              <button className={s.logoutButton} onClick={handleLogout}>
                로그아웃
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
