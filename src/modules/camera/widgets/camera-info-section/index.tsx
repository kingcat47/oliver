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
      <h1 className={s.title}>열화상 카메라</h1>
      <CameraSignalStrengthCard />
    </section>
  );
}
