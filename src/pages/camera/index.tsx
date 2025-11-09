import { useState } from "react";
import HasCamera from "./has-camera";
import HasNotCamera from "./hasnot-camera";

export default function Camera() {
  const [isCameraInfo] = useState(true);
  return <div>{isCameraInfo ? <HasCamera /> : <HasNotCamera />}</div>;
}
