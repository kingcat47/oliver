import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Button from "@/shared/components/butoon";
import MainLayout from "@/shared/components/main-layout";
import s from "./styles.module.scss";
import BluetoothRobot from "@/components/page/robot/bluetooth-robot";
import { ArrowRight } from "lucide-react";

type Step = "searching" | "found" | "registering" | "registered";

//1.로봇을 찾음
const FindRobot = ({ onNext }: { onNext: () => void }) => {
  return (
    <div className={s.container}>
      <div className={s.content}>
        <h1 className={s.title}>로봇을 찾음</h1>
        <p className={s.description}>아래 표시되는 로봇이 맞나요?</p>
      </div>

      <BluetoothRobot name="소화로봇" serialNumber="OLV960XFH-X92AG" />

      <div className={s.buttons}>
        <Button
          text="다른 로봇 찾기"
          onClick={() => {}}
          style={{ width: "100%", backgroundColor: "#EFF0F2", color: "#000" }}
        />
        <Button text="네, 맞아요" onClick={onNext} style={{ width: "100%" }} />
      </div>
    </div>
  );
};

//2.로봇 등록중
const RegisterRobot = ({ onNext }: { onNext: () => void }) => {
  useEffect(() => {
    // 1분(60초) 후 자동으로 다음 단계로 이동
    const timer = setTimeout(() => {
      onNext();
    }, 5000); // 60000ms = 1분

    return () => clearTimeout(timer);
  }, [onNext]);

  return (
    <div className={s.container}>
      <div className={s.content}>
        <h1 className={s.title}>로봇 등록중</h1>
        <p className={s.description}>
          완료될 때까지 로봇을 움직이거나 조작하지 말아주세요. 네트워크 및 센서
          상태를 초기화 중입니다.
        </p>
      </div>

      <BluetoothRobot name="소화로봇" serialNumber="OLV960XFH-X92AG" />

      <p style={{ color: "#000" }}>예상시간:1분</p>
    </div>
  );
};

//3.로봇 등록됨
const OkRobbot = ({ onExit }: { onExit: () => void }) => {
  useEffect(() => {
    // 5초 후 자동으로 홈으로 이동
    const timer = setTimeout(() => {
      onExit();
    }, 5000);

    return () => clearTimeout(timer);
  }, [onExit]);

  return (
    <div className={s.container}>
      <div className={s.content}>
        <h1 className={s.title}>로봇 등록됨</h1>
        <p className={s.description}>
          5초 뒤에 로봇 리스트 페이지로 이동합니다
        </p>
      </div>

      <BluetoothRobot name="소화로봇" serialNumber="OLV960XFH-X92AG" />

      <Button text="나가기" rightIcon={ArrowRight} onClick={onExit} />
    </div>
  );
};

//처음 시작
export default function Register2() {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>("searching");

  useEffect(() => {
    // 처음에 주변 로봇 찾는 중 화면에서 2초 후 자동으로 로봇을 찾음 단계로 이동
    if (step === "searching") {
      const timer = setTimeout(() => {
        setStep("found");
      }, 5000); // 2초 후

      return () => clearTimeout(timer);
    }
  }, [step]);

  const handleNext = () => {
    if (step === "found") {
      setStep("registering");
    } else if (step === "registering") {
      setStep("registered");
    }
  };

  const handleBack = () => {
    navigate("/robot/register/section1");
  };

  const handleExit = () => {
    navigate("/");
  };

  const renderContent = () => {
    switch (step) {
      case "searching":
        return (
          <>
            <div className={s.container}>
              <div className={s.content}>
                <h1 className={s.title}>주변 로봇 찾는 중...</h1>
                <p className={s.description}>
                  잠시 뒤 나오는 팝업에서 "OLV-FRI"로 시작하는 요소를
                  선택해주세요
                </p>
              </div>
              <img
                className={s.image}
                src="/sample/robot-link.svg"
                alt="find-robot"
              />
              <Button
                text="뒤로가기"
                onClick={handleBack}
                style={{ backgroundColor: "#EFF0F2", color: "#000" }}
              />
            </div>
          </>
        );
      case "found":
        return <FindRobot onNext={handleNext} />;
      case "registering":
        return <RegisterRobot onNext={handleNext} />;
      case "registered":
        return <OkRobbot onExit={handleExit} />;
      default:
        return null;
    }
  };

  return <MainLayout>{renderContent()}</MainLayout>;
}
