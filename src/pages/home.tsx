import MainLayout from "@/shared/components/main-layout";
import { Header, Sidebar } from "@/shared/widgets";

export default function Home() {
  return (
    <div>
      <Header />
      <MainLayout>
        <Sidebar />
        <span>s</span>
      </MainLayout>
    </div>
  );
}
