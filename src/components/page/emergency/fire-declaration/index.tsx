import { useState, useEffect } from "react";
import { Bot } from "lucide-react";
import s from "./styles.module.scss";

export default function FireDeclaration() {
  const [status, setStatus] = useState<"신고중" | "신고됨">("신고중");

  useEffect(() => {
    // 10초 후에 "신고중"에서 "신고됨"으로 변경
    const timer = setTimeout(() => {
      setStatus("신고됨");
    }, 10000); // 10초 = 10000ms

    // 컴포넌트 언마운트 시 타이머 정리
    return () => {
      clearTimeout(timer);
    };
  }, []);

  const title =
    status === "신고중"
      ? "관할 소방서로 자동 신고중"
      : "관할 소방서로 자동 신고됨";
  const description =
    status === "신고중"
      ? "실시간 로봇 영상 정보가 소방서로 전송 중입니다."
      : "실시간 로봇 영상 정보가 소방서로 전송됩니다.";

  return (
    <div className={s.container}>
      <div className={s.header}>
        <img src="/sample/119.svg" alt="fire-declaration" className={s.icon} />

        <div className={s.info}>
          <Bot size={16} className={s.botIcon} />
          <p className={s.botName}>올리버 AI</p>
        </div>
      </div>

      <div className={s.content}>
        <p className={`${s.title} ${s.fadeIn}`} key={status}>
          {title}
        </p>
        <p className={`${s.description} ${s.fadeIn}`} key={`${status}-desc`}>
          {description}
        </p>
      </div>
    </div>
  );
}
