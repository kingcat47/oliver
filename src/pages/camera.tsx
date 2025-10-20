import { CameraInfoSection, VideoSection } from "@/modules/camera/widgets";
import MainLayout from "@/shared/components/main-layout";
import { Header, Sidebar } from "@/shared/widgets";

export default function Camera() {
  return (
    <div>
      <Header />
      <MainLayout>
        <Sidebar />
        <CameraInfoSection />
        <VideoSection />
      </MainLayout>
    </div>
  );
}
