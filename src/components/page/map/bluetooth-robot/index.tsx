import s from "./styles.module.scss";

import { ChevronDown } from "lucide-react";

interface Props {
  battery: string;
  name: string;
  type: string;
}

export default function BluetoothRobot({ battery = "", name, type }: Props) {
  return (
    <div className={s.container}>
      <div className={s.smallcontainer}>
        <img
          className={s.image}
          src="/sample/fire-robot.svg"
          alt="find-robot"
        ></img>

        <div className={s.content}>
          <h1 className={s.name}>{name}</h1>

          <p className={s.type}>
            {type} · 배터리 {battery}%
          </p>
        </div>
      </div>

      <ChevronDown size={24} />
    </div>
  );
}
