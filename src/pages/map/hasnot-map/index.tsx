import { Button, MainLayout } from "@/shared/components";
import s from "./styles.module.scss";
import { Plus } from "lucide-react";

interface HasNotFloorsProps {
  onAddBuilding: () => void;
}

export default function HasNotFloors({ onAddBuilding }: HasNotFloorsProps) {
  return (
    <MainLayout>
      <div className={s.container}>
        <div className={s.content}>
          <h1 className={s.title}>공간이 추가되지 않았습니다</h1>
          <p className={s.description}>
            현재 관리 중인 공간이 없습니다.
            <br />
            공간을 추가하면 로봇의 작동 상태와 현장 영상을 모니터링할 수
            있습니다.
          </p>
        </div>
        <Button text="공간 추가하기" leftIcon={Plus} onClick={onAddBuilding} />
      </div>
    </MainLayout>
  );
}
