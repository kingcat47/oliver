import { MainLayout } from "@/shared/components";
import { CameraInfoSection, VideoSection } from "@/camera/widgets";

export default function HasCamera() {
  return (
    <MainLayout row>
      <CameraInfoSection />
      <VideoSection />
    </MainLayout>
  );
}
