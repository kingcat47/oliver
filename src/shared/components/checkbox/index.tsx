import { Check } from "lucide-react";
import { useState, useEffect } from "react";

import s from "./styles.module.scss";

interface Props {
  label?: string;
  defaultChecked?: boolean;
  checked?: boolean;
  onChange?: (checked: boolean) => void;
}

export default function Checkbox({
  label,
  defaultChecked = false,
  checked: controlledChecked,
  onChange,
}: Props) {
  const [internalChecked, setInternalChecked] = useState(defaultChecked);
  const isControlled = controlledChecked !== undefined;
  const checked = isControlled ? controlledChecked : internalChecked;

  useEffect(() => {
    if (isControlled) {
      // controlled mode에서는 prop 변경에 따라 업데이트
      setInternalChecked(controlledChecked);
    }
  }, [controlledChecked, isControlled]);

  const handleToggle = () => {
    const newChecked = !checked;
    if (!isControlled) {
      setInternalChecked(newChecked);
    }
    onChange?.(newChecked);
  };

  return (
    <label className={s.container} style={{ gap: label ? undefined : 0 }}>
      <div
        className={`${s.checkbox} ${checked ? s.checked : ""}`}
        onClick={handleToggle}
      >
        {checked && <Check className={s.checkIcon} />}
      </div>
      {label && <span className={s.label}>{label}</span>}
    </label>
  );
}
