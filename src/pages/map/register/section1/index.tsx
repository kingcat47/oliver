import { X } from "lucide-react";

import Button from "@/shared/components/butoon";
import Input from "@/shared/components/input";

import s from "./styles.module.scss";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function MapRegisterSection1() {
  const navigate = useNavigate();
  const [buildingName, setBuildingName] = useState("");
  const [address, setAddress] = useState("");

  const handleClose = () => {
    navigate("/map");
  };

  const handleNext = () => {
    if (buildingName && address) {
      navigate("/map/register/section2");
    }
  };

  return (
    <div className={s.container} onClick={handleClose}>
      <div className={s.modal} onClick={(e) => e.stopPropagation()}>
        <div className={s.header}>
          <h2 className={s.title}>건물 추가하기</h2>
          <button className={s.closeButton} onClick={handleClose}>
            <X size={24} />
          </button>
        </div>
        <div className={s.content}>
          <div className={s.inputContent}>
            <Input
              label="공간 이름"
              placeholder="공간 이름을 입력하세요"
              required
              value={buildingName}
              onChange={setBuildingName}
            />
            <Input
              label="상세 도로명 주소"
              placeholder="긴급 상황에 119에 사용되는 정보입니다."
              required
              value={address}
              onChange={setAddress}
            />
          </div>
        </div>
        <div className={s.footer}>
          <Button
            text="눌러서 추가하기"
            onClick={handleNext}
            disabled={!buildingName || !address}
          />
        </div>
      </div>
    </div>
  );
}
