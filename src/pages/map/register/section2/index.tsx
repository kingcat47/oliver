import BluetoothRobot from "@/components/page/map/bluetooth-robot";
import s from "./styles.module.scss";
import { Button, MainLayout } from "@/shared/components";
import { Radar } from "lucide-react";
import { useState } from "react";

type Step = "empty" | "scan";

//1.주변 공간 수집이 필요함
const Emptyfloor = ({ onNext }: { onNext: () => void }) => {
  return (
    <div className={s.container}>
      <div className={s.content}>
        <h1 className={s.title}>주변 공간 정보가 수집되지 않았습니다</h1>
        <div className={s.description}>
          <p>
            스캔을 시작하면 로봇이 Oliver LiDAR 센서를 이용해 주변 공간 구조를
            인식하고 지도를 생성합니다.
          </p>
          <p>
            스캔 중에는{" "}
            <span className={s.strong}>
              물체를 이동시키거나 사람이 이동하지 않도록 주의
            </span>
            해주세요.
          </p>
          <p>아래에서 건물 스캔에 사용할 로봇을 선택하세요.</p>
        </div>
      </div>

      <BluetoothRobot name="소화로봇" type="소화로봇" battery="100" />
      <div style={{ textAlign: "center" }}>
        <span className={s.strong}>예상 시간:</span>{" "}
        <span className={`${s.description} ${s.inline}`}>소형 공간</span>{" "}
        <span className={s.strong}>20분,</span>{" "}
        <span className={`${s.description} ${s.inline}`}>대형 공간</span>{" "}
        <span className={s.strong}>2시간 이상</span>
      </div>
      <div className={s.buttons}>
        <Button text="스캔 시작하기" rightIcon={Radar} onClick={onNext} />
      </div>
    </div>
  );
};

//2.층 스캔중
const Scanfloor = () => {
  return (
    <div className={s.container}>
      <div className={s.content}>
        <h1 className={s.title}>LiDAR 센서로 주변 공간 구조를 스캔중입니다</h1>
        <p className={s.description}>스캔 중엔 다른 작업을 하실 수 없습니다.</p>
      </div>
      <span className={s.strong}>예상 소요 시간 : 2시간 이상</span>
      <BluetoothRobot name="소화로봇" type="소화로봇" battery="100" />
    </div>
  );
};

export default function Section2() {
  const [step, setStep] = useState<Step>("empty");

  const handleNext = () => {
    if (step === "empty") {
      setStep("scan");
    }
  };

  const renderContent = () => {
    switch (step) {
      case "empty":
        return <Emptyfloor onNext={handleNext} />;
      case "scan":
        return <Scanfloor />;
      default:
        return null;
    }
  };
  return <MainLayout>{renderContent()}</MainLayout>;
}
