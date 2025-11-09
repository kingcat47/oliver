import MainLayout from "@/shared/components/main-layout";
import s from "./styles.module.scss";
import RobotList from "@/components/page/robot/robot-list";
export default function HasRobot() {
  return (
    <MainLayout>
      <div className={s.container}>
        <div className={s.content}>
          <h1 className={s.title}></h1>
          <p className={s.description}></p>
        </div>

        <RobotList />
      </div>
    </MainLayout>
  );
}
