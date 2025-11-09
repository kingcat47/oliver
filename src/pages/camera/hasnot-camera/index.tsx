import { MainLayout } from "@/shared/components";
import s from "./styles.module.scss";

export default function HasNotCamera() {
  return (
    <MainLayout>
      <div className={s.container}>
        <h1 className={s.title}>카메라 정보가 없습니다</h1>
        <p className={s.description}>
          재 화재 감지 센서가 정상 상태이며, 영상 스트림은 비활성화되어
          있습니다.
          <br />
          화재 상황이 발생하면 실시간 영상이 자동으로 표시됩니다.
        </p>
      </div>
    </MainLayout>
  );
}
