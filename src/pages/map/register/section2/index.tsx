import BluetoothRobot from "@/components/page/map/bluetooth-robot";
import s from "./styles.module.scss";
import { Button, MainLayout } from "@/shared/components";
import { Plus, Radar } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { getAllBuildings } from "@/api/building/service";

type Step = "empty" | "scan" | "noRobot";

//1.주변 공간 수집이 필요함
const Emptyfloor = ({
  onNext,
  floorId,
  selectedRobotId,
  onRobotSelect,
  onNoRobots,
}: {
  onNext: () => void;
  floorId: string | null;
  selectedRobotId: string | null;
  onRobotSelect: (robotId: string) => void;
  onNoRobots: () => void;
}) => {
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

      <BluetoothRobot
        floorId={floorId || undefined}
        selectedRobotId={selectedRobotId}
        onRobotSelect={onRobotSelect}
        onNoRobots={onNoRobots}
      />
      <div style={{ textAlign: "center" }}>
        <span className={s.strong}>예상 시간:</span>{" "}
        <span className={`${s.description} ${s.inline}`}>소형 공간</span>{" "}
        <span className={s.strong}>20분,</span>{" "}
        <span className={`${s.description} ${s.inline}`}>대형 공간</span>{" "}
        <span className={s.strong}>2시간 이상</span>
      </div>
      <div className={s.buttons}>
        <Button
          text="스캔 시작하기"
          rightIcon={Radar}
          onClick={onNext}
          style={{ backgroundColor: "#000", color: "#fff" }}
        />
      </div>
    </div>
  );
};

//2.층 스캔중
const Scanfloor = ({
  floorId,
  onComplete,
}: {
  floorId: string | null;
  onComplete: () => void;
}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 5000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className={s.container}>
      <div className={s.content}>
        <h1 className={s.title}>LiDAR 센서로 주변 공간 구조를 스캔중입니다</h1>
        <p className={s.description}>스캔 중엔 다른 작업을 하실 수 없습니다.</p>
      </div>
      <span className={s.strong}>예상 소요 시간 : 2시간 이상</span>
      <BluetoothRobot floorId={floorId || undefined} showChevron={false} />
    </div>
  );
};

//3.로봇이 없을 때
const NoRobot = ({ onRegister }: { onRegister: () => void }) => {
  return (
    <div className={s.container}>
      <div className={s.content}>
        <h1 className={s.title}>등록된 로봇이 없습니다</h1>
        <div className={s.description}>
          <p>건물 스캔을 시작하려면 먼저 로봇을 등록해야 합니다.</p>
          <p>아래 버튼을 눌러 로봇 등록 페이지로 이동하세요.</p>
        </div>
      </div>
      <div className={s.buttons}>
        <Button
          leftIcon={Plus}
          text="로봇 추가하기"
          onClick={onRegister}
          style={{ marginTop: "12px" }}
        />
      </div>
    </div>
  );
};

export default function Section2() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const floorId = searchParams.get("floorId");
  const [step, setStep] = useState<Step>("empty");
  const [loading, setLoading] = useState(true);
  const [selectedRobotId, setSelectedRobotId] = useState<string | null>(null);

  useEffect(() => {
    const checkRobots = async () => {
      try {
        setLoading(true);

        // buildingId 가져오기
        const buildingsResponse = await getAllBuildings();
        if (buildingsResponse.data.length === 0) {
          setStep("noRobot");
          return;
        }

        // floorId가 있으면 empty 단계로, 없으면 noRobot 단계로
        if (floorId) {
          setStep("empty");
        } else {
          setStep("noRobot");
        }
      } catch (error) {
        console.error("로봇 조회 실패:", error);
        setStep("noRobot");
      } finally {
        setLoading(false);
      }
    };

    checkRobots();
  }, [floorId]);

  const handleNext = () => {
    if (step === "empty") {
      setStep("scan");
    }
  };

  const handleRegister = () => {
    navigate("/robot/register/section1");
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className={s.container}>
          <div className={s.content}>
            <p className={s.description}>로딩 중...</p>
          </div>
        </div>
      );
    }

    switch (step) {
      case "empty":
        return (
          <Emptyfloor
            onNext={handleNext}
            floorId={floorId}
            selectedRobotId={selectedRobotId}
            onRobotSelect={setSelectedRobotId}
            onNoRobots={() => setStep("noRobot")}
          />
        );
      case "scan":
        return (
          <Scanfloor floorId={floorId} onComplete={() => navigate("/map")} />
        );
      case "noRobot":
        return <NoRobot onRegister={handleRegister} />;
      default:
        return null;
    }
  };
  return <MainLayout>{renderContent()}</MainLayout>;
}
