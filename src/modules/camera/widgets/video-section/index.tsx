import { RealtimeVideo } from "../../components";

import s from "./style.module.scss";

export default function VideoSection() {
  return (
    <section className={s.videoSection}>
      <RealtimeVideo />
      <RealtimeVideo />
      <RealtimeVideo />
      <RealtimeVideo />
      <RealtimeVideo />
    </section>
  );
}
