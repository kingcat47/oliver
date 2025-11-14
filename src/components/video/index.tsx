import s from "./style.module.scss";

export default function RealtimeVideo() {
  // Cloudflare Stream iframe URL with autoplay
  const cloudflareStreamUrl =
    "https://customer-ofozypfag8cjmsfq.cloudflarestream.com/55b680c5ee5400f60ea642eddbea475f/iframe?autoplay=true&muted=true";

  return (
    <iframe
      className={s.camera}
      src={cloudflareStreamUrl}
      allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
      allowFullScreen
      title="로봇 카메라"
    />
  );
}
