import {
  Check,
  Check as CheckIcon,
  ChevronDown,
  Layers2,
  Minus,
  Pencil,
  Plus,
  Plus as PlusIcon,
  Radar,
  Search,
  Settings,
  Trash2,
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

import {
  FireRobotDetailSection1,
  FireSensorDetailSection2,
} from "@/modules/camera/widgets";
import { FireRobot } from "@/mok/fire-robot";
import { FireSensor } from "@/mok/fire-sensor";
import Button from "@/shared/components/butoon";

import { SmallFireRobot, SmallFireSensor } from "../../small0robot-components";

// TODO: API에서 데이터 가져오기
// import { getAllBuildings, updateBuilding, getAllDevices } from "@/api";
// import { BuildingDto, DeviceDto } from "@/api";
import MapViewer from "./map-viewer";

import s from "./styles.module.scss";

interface Robot {
  id: string;
  name: string;
  x: number;
  y: number;
  type?: "robot" | "sensor";
}

interface Building {
  id: string;
  name: string;
}

interface Floor {
  id: string;
  level: number;
  name: string;
}

interface Props {
  onComplete?: () => void;
  onAddSpace?: () => void;
  buildings: Building[];
  floors: Floor[];
  maxFloorLevel: number;
  onFetchFloors: (buildingId: string) => Promise<void>;
  onAddFloor: (buildingId: string, floorName: string) => Promise<void>;
}

export default function MakeBuildSection3({
  onComplete: _onComplete,
  onAddSpace,
  buildings,
  floors,
  maxFloorLevel: _maxFloorLevel,
  onFetchFloors: _onFetchFloors,
  onAddFloor: _onAddFloor,
}: Props) {
  // comment: 지도 줌 레벨 상태 (50% ~ 200% 범위)
  const [zoomLevel, setZoomLevel] = useState(50);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedFloor, setSelectedFloor] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBuildingId, setSelectedBuildingId] = useState<string | null>(
    null,
  );
  const [robots, setRobots] = useState<Robot[]>([]);
  // comment: 지도 오프셋 상태 - 지도를 드래그할 때 x, y 좌표로 이동 위치를 저장
  const [mapOffset, setMapOffset] = useState({ x: 0, y: 0 });
  // comment: 지도 드래그 중인지 여부를 추적하는 상태
  const [isMapDragging, setIsMapDragging] = useState(false);
  const [draggedRobotId, setDraggedRobotId] = useState<string | null>(null);
  // comment: 지도 스케일 상태 - MapViewer에서 계산된 실제 스케일 값 (zoomLevel / 100)
  const [mapScale, setMapScale] = useState(1);
  const [showProductSelector, setShowProductSelector] = useState(false);
  const [selectedProductType, setSelectedProductType] = useState<
    "robot" | "sensor"
  >("robot");
  const [selectedRobotId, setSelectedRobotId] = useState<string | null>(null);
  const [showManagementModal, setShowManagementModal] = useState(false);
  const [editingFloor, setEditingFloor] = useState<string | null>(null);
  const [editedFloorName, setEditedFloorName] = useState("");
  const dragStartRef = useRef({ x: 0, y: 0 });
  const robotsRef = useRef(robots);
  const draggedRobotIdRef = useRef<string | null>(null);
  const mapScaleRef = useRef(1);

  useEffect(() => {
    robotsRef.current = robots;
  }, [robots]);

  useEffect(() => {
    draggedRobotIdRef.current = draggedRobotId;
  }, [draggedRobotId]);

  // comment: mapScale 변경 시 ref에 동기화하여 최신 스케일 값을 유지
  useEffect(() => {
    mapScaleRef.current = mapScale;
  }, [mapScale]);

  useEffect(() => {
    if (buildings.length > 0) {
      const firstBuilding = buildings[0];
      setSelectedBuildingId(firstBuilding.id);
      console.log("=== MakeBuildSection3 ===");
      console.log("Building ID:", firstBuilding.id);
      console.log("Building Name:", firstBuilding.name);
      console.log("All Buildings:", buildings);

      if (floors.length > 0) {
        setSelectedFloor(floors[0].name);
      }
    }
  }, [buildings, floors]);

  const currentBuilding = buildings.find((b) => b.id === selectedBuildingId);

  const filteredFloors = floors.filter((floor: Floor) => {
    return floor.name.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const checkOverlap = (robot: Robot): boolean => {
    // 배율에 따라 컴포넌트 크기 조정 (기본 100px, mapScale이 0이면 기본값 1 사용)
    const currentScale = mapScale || 1;
    const robotWidth = 100 * currentScale;
    const robotHeight = 100 * currentScale;

    // 같은 위치에 다른 로봇이 있는지 확인 (화재감지기)
    return robots.some(
      (r) =>
        r.id !== robot.id &&
        r.type === "sensor" &&
        Math.abs(r.x * currentScale - robot.x * currentScale) < robotWidth &&
        Math.abs(r.y * currentScale - robot.y * currentScale) < robotHeight,
    );
  };

  // comment: 지도 드래그 시작 핸들러 - 마우스 다운 시 지도 드래그 모드로 전환하고 시작 위치 저장
  const handleMapMouseDown = (e: React.MouseEvent) => {
    // comment: 로봇 컴포넌트를 클릭한 경우 지도 드래그가 아닌 로봇 드래그로 처리
    if ((e.target as HTMLElement).closest("[data-robot]")) return;
    setIsMapDragging(true);
    // comment: 현재 마우스 위치에서 지도 오프셋을 뺀 값을 시작 위치로 저장
    const startPos = { x: e.clientX - mapOffset.x, y: e.clientY - mapOffset.y };
    dragStartRef.current = startPos;
  };

  const handleRobotMouseDown = (e: React.MouseEvent, robotId: string) => {
    e.stopPropagation();
    setDraggedRobotId(robotId);
    const robot = robotsRef.current.find((r) => r.id === robotId);
    if (!robot) return;
    const startPos = {
      x: e.clientX - robot.x * mapScaleRef.current,
      y: e.clientY - robot.y * mapScaleRef.current,
    };
    dragStartRef.current = startPos;
  };

  // comment: 지도 줌 핸들러 - 마우스 휠 이벤트로 지도 확대/축소 (50% ~ 200% 범위 제한)
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    // comment: 휠 델타 값을 -0.1로 곱하여 줌 레벨 변화량 계산 (음수로 곱하여 자연스러운 방향)
    const delta = e.deltaY * -0.1;
    // comment: 새로운 줌 레벨 계산 (50% ~ 200% 범위로 제한)
    const newZoom = Math.round(Math.min(200, Math.max(50, zoomLevel + delta)));
    setZoomLevel(newZoom);
  };

  const handleRobotDoubleClick = (robotId: string) => {
    setSelectedRobotId(robotId);
  };

  const handleEditFloor = (floor: string) => {
    setEditingFloor(floor);
    setEditedFloorName(floor);
  };

  const handleSaveFloor = async () => {
    if (!selectedBuildingId || !editingFloor) return;
    // TODO: API로 층 이름 업데이트
    // await updateFloor(selectedBuildingId, floorId, { name: editedFloorName });

    // selectedFloor도 업데이트
    if (selectedFloor === editingFloor) {
      setSelectedFloor(editedFloorName);
    }

    setEditingFloor(null);
    setEditedFloorName("");
  };

  const handleDeleteFloor = async (floorToDelete: string) => {
    if (!selectedBuildingId) return;
    // TODO: API로 층 삭제
    // await deleteFloor(selectedBuildingId, floorId);

    // 선택된 층이 삭제되면 첫 번째 층으로 변경
    const remainingFloors = floors.filter((f) => f.name !== floorToDelete);
    if (selectedFloor === floorToDelete && remainingFloors.length > 0) {
      setSelectedFloor(remainingFloors[0].name);
    }
  };

  const handleMoveBuilding = () => {
    // TODO: 건물 이동 기능 구현
    console.log("건물 이동하기 클릭됨");
  };

  const getSelectedRobotDetail = () => {
    if (!selectedRobotId) return null;
    const robot = robots.find((r) => r.id === selectedRobotId);
    if (!robot) return null;

    // TODO: API에서 디바이스 상세 정보 가져오기
    // return await getDeviceById(selectedRobotId);
    return robot;
  };

  const selectedRobotDetail = getSelectedRobotDetail();
  const isFireRobot =
    selectedRobotDetail &&
    robots.find((r) => r.id === selectedRobotId)?.type === "robot";

  // comment: 전역 마우스 이벤트 리스너 - 지도 드래그 및 로봇 드래그 처리
  useEffect(() => {
    const handleGlobalMouseMove = (e: MouseEvent) => {
      // comment: 지도 드래그 중인 경우 마우스 이동에 따라 지도 오프셋 업데이트
      if (isMapDragging) {
        setMapOffset({
          x: e.clientX - dragStartRef.current.x,
          y: e.clientY - dragStartRef.current.y,
        });
      }
      // comment: 로봇 드래그 중인 경우 마우스 이동에 따라 로봇 위치 업데이트 (지도 스케일 고려)
      if (draggedRobotIdRef.current) {
        // comment: 마우스 좌표를 지도 스케일로 나누어 실제 지도 좌표계로 변환
        const newX = (e.clientX - dragStartRef.current.x) / mapScaleRef.current;
        const newY = (e.clientY - dragStartRef.current.y) / mapScaleRef.current;
        setRobots(
          robotsRef.current.map((robot) =>
            robot.id === draggedRobotIdRef.current
              ? { ...robot, x: newX, y: newY }
              : robot,
          ),
        );
      }
    };

    // comment: 마우스 업 이벤트 - 드래그 종료 처리
    const handleGlobalMouseUp = () => {
      setIsMapDragging(false);
      setDraggedRobotId(null);
    };

    document.addEventListener("mousemove", handleGlobalMouseMove);
    document.addEventListener("mouseup", handleGlobalMouseUp);

    return () => {
      document.removeEventListener("mousemove", handleGlobalMouseMove);
      document.removeEventListener("mouseup", handleGlobalMouseUp);
    };
  }, [isMapDragging]);

  return (
    <div className={s.container}>
      <div className={s.controlBar}>
        <div className={s.buildingSelectorWrapper}>
          <button
            className={s.buildingSelector}
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            <div className={s.right}>
              <Layers2 size={20} className={s.buildingIcon} />
              <span className={s.buildingName}>
                {currentBuilding?.name || ""} - {selectedFloor || "층 선택"}
              </span>
              <div className={s.dropdownCircle}>
                <ChevronDown size={20} />
              </div>
            </div>
          </button>

          {isDropdownOpen && (
            <div className={s.dropdown}>
              {/* Search Section */}
              <div className={s.searchSection}>
                <div className={s.searchInput}>
                  <Search size={18} className={s.searchIcon} />
                  <input
                    type="text"
                    placeholder="검색하기"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className={s.searchField}
                  />
                </div>
              </div>

              {/* Floor List Section */}
              <div className={s.floorList}>
                {filteredFloors.map((floor: Floor) => {
                  return (
                    <button
                      key={floor.id}
                      className={`${s.floorItem} ${floor.name === selectedFloor ? s.floorItemActive : ""}`}
                      onClick={() => {
                        setSelectedFloor(floor.name);
                        setIsDropdownOpen(false);
                      }}
                    >
                      {floor.name}
                    </button>
                  );
                })}
              </div>

              {/* Action Buttons Section */}
              <div className={s.actionSection}>
                <button
                  className={s.actionButton}
                  onClick={() => {
                    setIsDropdownOpen(false);
                    onAddSpace?.();
                  }}
                >
                  <PlusIcon size={16} />
                  <span>공간 추가</span>
                </button>
                <button
                  className={s.actionButton}
                  onClick={() => {
                    setIsDropdownOpen(false);
                    setShowManagementModal(true);
                  }}
                >
                  <Settings size={16} />
                  <span>관리</span>
                </button>
              </div>
            </div>
          )}
        </div>

        <div className={s.zoomControls}>
          <button
            className={s.invertedButton}
            onClick={() => setZoomLevel(Math.max(0, zoomLevel - 10))}
          >
            <Minus size={20} />
          </button>
          <button className={s.zoomDisplay}>{zoomLevel}%</button>
          <button
            className={s.invertedButton}
            onClick={() => setZoomLevel(Math.min(200, zoomLevel + 10))}
          >
            <Plus size={20} />
          </button>
        </div>
      </div>

      {/* comment: 지도 컨테이너 - 드래그 및 줌 이벤트 핸들러 연결 */}
      <div
        onMouseDown={handleMapMouseDown}
        onWheel={handleWheel}
        style={{ width: "100%", height: "100%" }}
      >
        {/* comment: MapViewer 컴포넌트 - 실제 지도 이미지를 렌더링하고 줌/오프셋 적용 */}
        <MapViewer
          zoomLevel={zoomLevel}
          mapOffset={mapOffset}
          onMapScaleChange={setMapScale}
        >
          {/* comment: 지도 위에 표시될 로봇 컴포넌트들 - 지도 스케일에 맞춰 위치와 크기 조정 */}
          {robots.map((robot) => {
            const RobotComponent =
              robot.type === "sensor" ? SmallFireSensor : SmallFireRobot;
            const isOverlapped = checkOverlap(robot);
            // comment: 현재 지도 스케일 값 (0이면 기본값 1 사용)
            const currentScale = mapScale || 1;
            // comment: 로봇의 실제 좌표에 지도 스케일을 곱하여 화면 좌표로 변환
            return (
              <RobotComponent
                key={robot.id}
                name={robot.name}
                x={robot.x * currentScale}
                y={robot.y * currentScale}
                scale={currentScale}
                onMouseDown={(e) => handleRobotMouseDown(e, robot.id)}
                onDoubleClick={() => handleRobotDoubleClick(robot.id)}
                isOverlapped={isOverlapped}
              />
            );
          })}
        </MapViewer>
      </div>

      <div className={s.bottomBar}>
        <Button
          text="제품 추가하기"
          leftIcon={Plus}
          onClick={() => setShowProductSelector(true)}
        />

        <button className={s.rescanButton}>
          <Radar size={16} />
          <span>공간 다시 스캔하기</span>
        </button>
      </div>

      {showProductSelector && (
        <>
          <div
            className={s.overlay}
            onClick={() => setShowProductSelector(false)}
          />
          <div className={s.productSelectorWidget}>
            <div className={s.productSelectorHeader}>
              <h2 className={s.productSelectorTitle}>제품 선택</h2>
              <button
                className={s.closeButton}
                onClick={() => setShowProductSelector(false)}
              >
                <X size={24} />
              </button>
            </div>

            <div className={s.productCards}>
              <div
                className={`${s.productCard} ${selectedProductType === "robot" ? s.selected : ""}`}
                onClick={() => setSelectedProductType("robot")}
              >
                <h3 className={s.productCardTitle}>소화 로봇</h3>
                <p className={s.productCardDescription}>
                  화재가 발생하였을 때 초기 진압을 하는 로봇입니다
                </p>
                <div className={s.productCardImage}>
                  <img src="/sample/fire-robot.svg" alt="소화 로봇" />
                </div>
                <div className={s.checkIndicator}>
                  {selectedProductType === "robot" ? (
                    <div className={s.checkBoxChecked}>
                      <Check size={16} color="white" />
                    </div>
                  ) : (
                    <div className={s.checkBox} />
                  )}
                </div>
              </div>

              <div
                className={`${s.productCard} ${selectedProductType === "sensor" ? s.selected : ""}`}
                onClick={() => setSelectedProductType("sensor")}
              >
                <h3 className={s.productCardTitle}>화재 감지기</h3>
                <p className={s.productCardDescription}>
                  올리버 시스템과 연동되어 화재를 감지합니다
                </p>
                <div className={s.productCardImage}>
                  <img src="/sample/fire-robot.svg" alt="화재 감지기" />
                </div>
                <div className={s.checkIndicator}>
                  {selectedProductType === "sensor" ? (
                    <div className={s.checkBoxChecked}>
                      <Check size={16} color="white" />
                    </div>
                  ) : (
                    <div className={s.checkBox} />
                  )}
                </div>
              </div>
            </div>

            <div className={s.productSelectorFooter}>
              <Button
                text="확인"
                onClick={() => {
                  // 현재 배율에 따라 위치와 크기 조정 (mapScale이 0이면 기본값 1 사용)
                  const currentScale = mapScale || 1;
                  const baseX = 100 / currentScale;
                  const baseY = 100 / currentScale;
                  const spacing = 10 / currentScale;

                  const newRobot: Robot = {
                    id: `robot-${Date.now()}`,
                    name: selectedProductType === "robot" ? "RX-780" : "FS-101",
                    x: baseX + robots.length * spacing,
                    y: baseY + robots.length * spacing,
                    type: selectedProductType,
                  };
                  setRobots([...robots, newRobot]);
                  setShowProductSelector(false);
                }}
              />
            </div>
          </div>
        </>
      )}

      {selectedRobotId && selectedRobotDetail && (
        <>
          {/* 오버레이 */}
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(0, 0, 0, 0.4)",
              zIndex: 999,
            }}
            onClick={() => setSelectedRobotId(null)}
          />

          {/* 위젯 */}
          <div
            style={{
              position: "fixed",
              top: 0,
              right: 0,
              bottom: 0,
              zIndex: 1000,
              display: "flex",
              alignItems: "center",
              paddingRight: "12px",
            }}
          >
            {isFireRobot ? (
              <FireRobotDetailSection1
                robot={selectedRobotDetail as unknown as FireRobot}
                onClose={() => setSelectedRobotId(null)}
                onDelete={() => {
                  setRobots(robots.filter((r) => r.id !== selectedRobotId));
                  setSelectedRobotId(null);
                }}
                onMoveBuilding={handleMoveBuilding}
              />
            ) : (
              <FireSensorDetailSection2
                sensor={selectedRobotDetail as unknown as FireSensor}
                onClose={() => setSelectedRobotId(null)}
                onDelete={() => {
                  setRobots(robots.filter((r) => r.id !== selectedRobotId));
                  setSelectedRobotId(null);
                }}
                onMoveBuilding={handleMoveBuilding}
              />
            )}
          </div>
        </>
      )}

      {showManagementModal && currentBuilding && (
        <>
          <div
            className={s.overlay}
            onClick={() => setShowManagementModal(false)}
          />
          <div className={s.managementModal}>
            <div className={s.managementHeader}>
              <h2 className={s.managementTitle}>공간 관리하기</h2>
              <button
                className={s.closeButton}
                onClick={() => setShowManagementModal(false)}
              >
                <X size={24} className={s.closeButtonIcon} />
              </button>
            </div>

            <div className={s.managementFloorList}>
              {filteredFloors.map((floor: Floor) => {
                return (
                  <div key={floor.id} className={s.managementFloorItem}>
                    <div className={s.managementFloorLeft}>
                      <div className={s.managementFloorInfo}>
                        <div className={s.managementFloorLeftTop}>
                          <div className={s.managementFloorIcon}>
                            <Layers2 size={26} />
                          </div>
                          {editingFloor === floor.name ? (
                            <input
                              type="text"
                              value={editedFloorName}
                              onChange={(e) =>
                                setEditedFloorName(e.target.value)
                              }
                              className={s.managementFloorNameInput}
                              autoFocus
                            />
                          ) : (
                            <div className={s.managementFloorName}>
                              {floor.name}
                            </div>
                          )}
                        </div>

                        <div className={s.managementFloorAddress}>
                          {currentBuilding.name}
                        </div>
                      </div>
                    </div>
                    <div className={s.managementFloorActions}>
                      {editingFloor === floor.name ? (
                        <button
                          className={s.managementSaveButton}
                          onClick={handleSaveFloor}
                        >
                          <CheckIcon size={24} />
                        </button>
                      ) : (
                        <button
                          className={s.managementEditButton}
                          onClick={() => handleEditFloor(floor.name)}
                        >
                          <Pencil size={24} />
                        </button>
                      )}
                      {editingFloor !== floor.name && (
                        <button
                          className={s.managementDeleteButton}
                          onClick={() => handleDeleteFloor(floor.name)}
                        >
                          <Trash2 size={24} />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
            <div className={s.managementFooter}></div>
          </div>
        </>
      )}
    </div>
  );
}
