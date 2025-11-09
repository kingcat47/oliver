import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "@/shared/components/butoon";
import MainLayout from "@/shared/components/main-layout";
import { ArrowRight } from "lucide-react";

import s from "./styles.module.scss";
import RobotRegisterCard from "@/components/page/robot/robot-register-card";

export default function Register1() {
  const navigate = useNavigate();
  const [selectedType, setSelectedType] = useState<"robot" | "sensor" | null>(
    null
  );

  const handleNext = () => {
    if (selectedType) {
      navigate("/robot/register/section2");
    }
  };

  const handleCardSelect = (type: "robot" | "sensor") => {
    setSelectedType(type);
  };

  const isNextDisabled = selectedType === null;

  return (
    <MainLayout>
      <div className={s.container}>
        <div className={s.content}>
          <h1 className={s.title}>로봇 등록하기</h1>
          <p className={s.description}>
            아래 버튼을 눌러 Oliver 로봇을 등록해주세요
          </p>
        </div>

        <div className={s.choice}>
          <RobotRegisterCard
            title="소화 로봇"
            description="화재가 발생하였을 때 초기 진압을 하는 로봇입니다"
            image="/sample/fire-robot.svg"
            selected={selectedType === "robot"}
            onSelect={() => handleCardSelect("robot")}
          />

          <RobotRegisterCard
            title="화재 감지기기"
            description="올리버 시스템과 연동되어 화재를 감지합니다"
            image="/sample/fire-robot.svg"
            selected={selectedType === "sensor"}
            onSelect={() => handleCardSelect("sensor")}
          />
        </div>

        <Button
          text="다음"
          rightIcon={ArrowRight}
          onClick={handleNext}
          disabled={isNextDisabled}
        />
      </div>
    </MainLayout>
  );
}
