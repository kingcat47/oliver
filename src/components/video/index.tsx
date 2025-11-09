import s from "./style.module.scss";

export default function RealtimeVideo() {
  return (
    <video className={s.camera} autoPlay muted loop>
      <source src="/sample/neo.mp4" type="video/mp4" />
    </video>
  );
}
