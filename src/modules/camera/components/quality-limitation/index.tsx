import { Card } from "@/shared/components";

import s from "./style.module.scss";

export default function CameraQualityLimitationCard() {
  return (
    <Card>
      <Card.Title>성능 제한</Card.Title>
      <div className={s.content}></div>
    </Card>
  );
}
