import { Sidebar } from "@/components/layout/sidebar";
import { TopNav } from "@/components/layout/top-nav";
import { DemoBanner } from "@/components/demo/demo-banner";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen w-full bg-background overflow-hidden">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <DemoBanner />
        <TopNav />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-muted/20">{children}</main>
      </div>
    </div>
  );
}
