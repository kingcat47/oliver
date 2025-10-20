import { ArrowUpRight, CircleQuestionMark } from "lucide-react";
import { useState } from "react";

import { Segment } from "@/shared/components";

import { CameraSignalStrengthCard } from "../../components";

import s from "./style.module.scss";

export default function CameraInfoSection() {
  const [selectedSegment, setSelectedSegment] = useState("thermal");
  return (
    <section className={s.cameraInfoSection}>
      <Segment
        items={[
          { label: "열화상 카메라", value: "thermal" },
          { label: "카메라", value: "camera" },
        ]}
        selected={selectedSegment}
        onChange={setSelectedSegment}
      />
      <div className={s.content}>
        <div className={s.header}>
          <h1 className={s.title}>열화상 카메라</h1>
          <a
            href="https://namu.wiki/w/%EC%97%B4%ED%99%94%EC%83%81%EC%B9%B4%EB%A9%94%EB%9D%BC"
            target="_blank"
            rel="noopener noreferrer"
          >
            <CircleQuestionMark />
          </a>
        </div>
        <p>
          열화상 카메라는 적외선을 감지해 물체의 온도를 시각적으로 표시하는
          카메라입니다.
          <br />
          즉, 사람이 눈으로 볼 수 없는 열 정보를 영상으로 변환하여, 온도가 높은
          부분은 밝게, 낮은 부분은 어둡게 표현합니다.
        </p>
      </div>
      <CameraSignalStrengthCard />
    </section>
  );
}
