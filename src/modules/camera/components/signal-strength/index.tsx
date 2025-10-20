import { Card } from "@/shared/components";

import s from "./style.module.scss";

interface Props {
  averageDelay: number;
  maxDelay: number;
  medianDelay: number;
}

export default function CameraSignalStrengthCard({
  averageDelay,
  maxDelay,
  medianDelay,
}: Props) {
  return (
    <Card>
      <Card.Title>영상 신호 퀄리티</Card.Title>
      <div className={s.content}>
        <div>
          <div className={s.signalStrength}>
            <span>평균 지연</span>
            <svg
              width="10"
              height="10"
              viewBox="0 0 10 10"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle cx="5" cy="5" r="5" />
            </svg>
          </div>

          <span>{averageDelay}ms</span>
        </div>
        <div>
          <span>최대 지연</span>
          <span>{maxDelay}ms</span>
        </div>
        <div>
          <span>중앙값</span>
          <span>{medianDelay}ms</span>
        </div>
      </div>
    </Card>
  );
}
