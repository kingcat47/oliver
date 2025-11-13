import MainLayout from "@/shared/components/main-layout";
import s from "./styles.module.scss";
import RobotList from "@/components/page/robot/robot-list";
import Button from "@/shared/components/butoon";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function HasRobot() {
  const navigate = useNavigate();

  const handleAddRobot = () => {
    navigate("/robot/register/section1");
  };

  return (
    <MainLayout>
      <div className={s.container}>
        <div className={s.header}>
          <div className={s.content}>
            <h1 className={s.title}>로봇 리스트</h1>
            <p className={s.description}>
              로봇을 눌러서 상세 정보를 볼 수 있습니다
            </p>
          </div>
          <Button
            text="로봇 추가하기"
            leftIcon={Plus}
            onClick={handleAddRobot}
          />
        </div>

        <RobotList />
      </div>
    </MainLayout>
  );
}
