import { useEffect, useRef } from "react";

import s from "./styles.module.scss";

interface Props {
  zoomLevel: number;
  mapOffset?: { x: number; y: number };
  children?: React.ReactNode;
  onMapScaleChange?: (scale: number) => void;
}

export default function MapViewer({
  zoomLevel,
  mapOffset = { x: 0, y: 0 },
  children,
  onMapScaleChange,
}: Props) {
  // comment: 지도 이미지를 그릴 Canvas 요소의 ref
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // comment: 지도 이미지 로드 및 렌더링 - 줌 레벨 변경 시 지도 크기 재계산 및 재그리기
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // comment: 지도 이미지 객체 생성 및 CORS 설정
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      console.log("이미지 로드됨:", img.width, "x", img.height);

      // comment: 지도의 기본 크기 (고정값)
      const baseWidth = 1200;
      const baseHeight = 600;

      // comment: 줌 레벨(50~200)을 스케일 값(0.5~2.0)으로 변환
      const scale = zoomLevel / 100;
      // comment: 줌 레벨에 따라 지도 크기 계산
      const width = baseWidth * scale;
      const height = baseHeight * scale;

      // comment: Canvas 크기를 계산된 크기로 설정
      canvas.width = width;
      canvas.height = height;

      // comment: Canvas에 지도 이미지 그리기 (계산된 크기로 스케일링)
      ctx.drawImage(img, 0, 0, width, height);

      // comment: 계산된 스케일 값을 부모 컴포넌트에 전달 (로봇 위치 계산에 사용)
      if (onMapScaleChange) {
        onMapScaleChange(scale);
      }
    };

    img.onerror = () => {
      console.error("이미지 로드 실패");
    };

    // comment: 지도 이미지 경로
    img.src = "/sample/mpas/my_map.png";
  }, [zoomLevel, onMapScaleChange]);

  return (
    <div className={s.mapContainer}>
      {/* comment: 지도 Canvas - mapOffset으로 드래그 위치 적용 */}
      <canvas
        ref={canvasRef}
        className={s.mapCanvas}
        style={{
          transform: `translate(${mapOffset.x}px, ${mapOffset.y}px)`,
        }}
      />
      {/* comment: 지도 위에 표시될 자식 요소들 (로봇 등) - 지도와 동일한 오프셋 적용 */}
      <div
        style={{ transform: `translate(${mapOffset.x}px, ${mapOffset.y}px)` }}
      >
        {children}
      </div>
    </div>
  );
}
