import { useState, useEffect } from "react";
import { Pencil, BatteryFull, Wifi, Timer, Calendar } from "lucide-react";
import s from "./styles.module.scss";
import { Button, Segment } from "@/shared/components";
import DeviceLog from "../../emergency/device-log";
import { X } from "lucide-react";
import { getDeviceById, updateDevice, deleteDevice } from "@/api/bot/service";
import { DeviceType } from "@/api/bot/dto/device";

interface RobotDetailProps {
  deviceId: string;
  onClose?: () => void;
  onUpdate?: () => void;
}

export default function RobotDetail({
  deviceId,
  onClose,
  onUpdate,
}: RobotDetailProps) {
  const [device, setDevice] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isEditingName, setIsEditingName] = useState(false);
  const [editedName, setEditedName] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [selectedCamera, setSelectedCamera] = useState<"thermal" | "normal">(
    "thermal"
  );
  const [isDeleting, setIsDeleting] = useState(false);

  // 화재감지기일 때 name에서 tuya 키 부분 제거하는 헬퍼 함수
  const getDisplayName = (rawName: string, deviceType: DeviceType): string => {
    const isSensor = deviceType === DeviceType.SENSOR;
    return isSensor && rawName.includes("-tuya-key-")
      ? rawName.split("-tuya-key-")[0]
      : rawName;
  };

  // 디바이스 상세 정보 가져오기
  useEffect(() => {
    const fetchDeviceDetail = async () => {
      try {
        setLoading(true);
        const deviceData = await getDeviceById(deviceId);
        setDevice(deviceData);
        const displayName = getDisplayName(
          deviceData.name || "",
          deviceData.type
        );
        setEditedName(displayName);
      } catch (error) {
        console.error("디바이스 상세 정보 가져오기 실패:", error);
      } finally {
        setLoading(false);
      }
    };

    if (deviceId) {
      fetchDeviceDetail();
    }
  }, [deviceId]);

  // 배터리 상태 계산
  const getBatteryStatus = (battery: number): string => {
    if (battery <= 20) return "낮음";
    if (battery <= 50) return "보통";
    return "높음";
  };

  // 통신 상태 계산
  const getCommunicationStatus = (status: number): string => {
    if (status >= 80) return "좋음";
    if (status >= 50) return "보통";
    if (status >= 20) return "나쁨";
    return "매우 나쁨";
  };

  // 업타임 포맷팅 (초를 일/시간/분으로 변환)
  const formatUptime = (seconds: number): string => {
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);

    if (days > 0) {
      return `${days}일`;
    } else if (hours > 0) {
      return `${hours}시간`;
    } else if (minutes > 0) {
      return `${minutes}분`;
    }
    return "1분 미만";
  };

  // 등록일자 포맷팅
  const formatDate = (dateString?: string): string => {
    if (!dateString) return "정보 없음";
    try {
      const date = new Date(dateString);
      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      const day = date.getDate();
      const hours = date.getHours();
      const minutes = date.getMinutes();
      return `${year}년 ${month}월 ${day}일 ${hours}시 ${minutes}분`;
    } catch (error) {
      return "정보 없음";
    }
  };

  // 로딩 중이거나 디바이스 정보가 없을 때
  if (loading || !device) {
    return (
      <div className={s.container}>
        <div style={{ padding: "40px", textAlign: "center", color: "#8B8B8B" }}>
          로딩 중...
        </div>
      </div>
    );
  }

  // 화재감지기일 때는 name에서 tuya 키 부분 제거
  const name = getDisplayName(device.name || "이름 없음", device.type);
  const isSensor = device.type === DeviceType.SENSOR;
  const type = device.type === DeviceType.ROBOT ? "소화 로봇" : "화재 감지기";
  const batteryLevel = device.batteryLevel || 0;
  const createdAt = device.createdAt;
  const communicationStatus = device.communicationStatus || 0;
  const uptimeSeconds = device.uptimeSeconds || 0;

  const batteryStatus = getBatteryStatus(batteryLevel);
  const formattedDate = formatDate(createdAt);
  const communicationStatusText = getCommunicationStatus(communicationStatus);
  const uptimeText = formatUptime(uptimeSeconds);

  const handleEditNameClick = () => {
    setIsEditingName(true);
    if (device) {
      const displayName = getDisplayName(device.name || "", device.type);
      setEditedName(displayName);
    }
  };

  const handleCancelEdit = () => {
    setIsEditingName(false);
    if (device) {
      const displayName = getDisplayName(device.name || "", device.type);
      setEditedName(displayName);
    }
  };

  const handleSaveName = async () => {
    if (!editedName.trim()) {
      alert("이름을 입력해주세요.");
      return;
    }

    if (!device?.deviceId) {
      alert("디바이스 정보를 불러올 수 없습니다.");
      return;
    }

    try {
      setIsSaving(true);
      await updateDevice(device.deviceId, { name: editedName.trim() });
      setDevice((prev: any) => ({ ...prev, name: editedName.trim() }));
      setIsEditingName(false);
      onUpdate?.();
    } catch (error) {
      console.error("이름 변경 실패:", error);
      alert("이름 변경에 실패했습니다.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteDevice = async () => {
    if (!device?.deviceId) {
      alert("디바이스 정보를 불러올 수 없습니다.");
      return;
    }

    if (!confirm("정말로 이 디바이스를 삭제하시겠습니까?")) {
      return;
    }

    try {
      setIsDeleting(true);
      await deleteDevice(device.deviceId);
      alert("디바이스가 삭제되었습니다.");
      onUpdate?.();
      onClose?.();
    } catch (error) {
      console.error("디바이스 삭제 실패:", error);
      alert("디바이스 삭제에 실패했습니다.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className={s.container}>
      <div className={s.header}>
        <div className={s.header_content}>
          <div className={s.header_content_title_wrapper}>
            {isEditingName ? (
              <>
                <input
                  type="text"
                  value={editedName}
                  onChange={(e) => setEditedName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleSaveName();
                    } else if (e.key === "Escape") {
                      handleCancelEdit();
                    }
                  }}
                  className={s.name_input}
                  autoFocus
                  disabled={isSaving}
                />
                <div className={s.edit_buttons}>
                  <button
                    className={s.save_button}
                    onClick={handleSaveName}
                    disabled={isSaving}
                  >
                    저장
                  </button>
                  <button
                    className={s.cancel_button}
                    onClick={handleCancelEdit}
                    disabled={isSaving}
                  >
                    취소
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className={s.header_content_title}>{name}</div>
                <button
                  className={s.edit_button}
                  onClick={handleEditNameClick}
                  type="button"
                >
                  <Pencil size={16} color="#8b8b8b" />
                </button>
              </>
            )}
          </div>

          <div className={s.header_content_subtitle}>{type}</div>
        </div>
        {onClose && (
          <button className={s.header_close} onClick={onClose}>
            <X size={24} color="#8b8b8b" />
          </button>
        )}
      </div>
      <div className={s.content}>
        <div className={s.content_info}>
          <div className={s.info_row}>
            <div className={s.info_card}>
              <div className={s.info_card_header}>
                <BatteryFull size={18} className={s.info_icon} />
                <span className={s.info_label}>배터리</span>
              </div>
              <span className={s.info_value}>
                {batteryStatus} ({batteryLevel}%)
              </span>
            </div>
            <div className={s.info_card}>
              <div className={s.info_card_header}>
                <Wifi size={18} className={s.info_icon} />
                <span className={s.info_label}>통신 상태</span>
              </div>
              <span className={s.info_value}>{communicationStatusText}</span>
            </div>
          </div>
          <div className={s.info_row}>
            <div className={s.info_card}>
              <div className={s.info_card_header}>
                <Timer size={18} className={s.info_icon} />
                <span className={s.info_label}>업타임</span>
              </div>
              <span className={s.info_value}>{uptimeText}</span>
            </div>
            <div className={s.info_card}>
              <div className={s.info_card_header}>
                <Calendar size={18} className={s.info_icon} />
                <span className={s.info_label}>등록 일자</span>
              </div>
              <span className={s.info_value}>{formattedDate}</span>
            </div>
          </div>
        </div>
        {!isSensor && (
          <div className={s.content_camera}>
            <h1 className={s.content_camera_title}>로봇 카메라</h1>
            <div className={s.content_camera_content}>
              <iframe
                className={s.camera_iframe}
                src="https://customer-ofozypfag8cjmsfq.cloudflarestream.com/55b680c5ee5400f60ea642eddbea475f/iframe?autoplay=true&muted=true"
                allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
                allowFullScreen
                title={`${name} 카메라`}
              />
            </div>
          </div>
        )}
        <div className={s.content_map}>
          <h1 className={s.content_map_title}>위치</h1>
          <div className={s.content_map_info}>
            <p className={s.floor_text}>
              {device.location?.floorName || "정보 없음"}
            </p>
          </div>
        </div>
        <div className={s.content_log}>
          <h1 className={s.content_log_title}>최근 기록</h1>
          <div className={s.content_log_content}>
            <DeviceLog hideTitle={true} deviceId={deviceId} />
          </div>
        </div>
      </div>
      <div className={s.footer}>
        <Button
          text="로봇 삭제하기"
          variant="primary"
          style={{ backgroundColor: "#F03839", color: "#fff" }}
          onClick={handleDeleteDevice}
          disabled={isDeleting}
        />
      </div>
    </div>
  );
}
