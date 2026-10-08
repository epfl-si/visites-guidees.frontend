import { Outlet } from "react-router";
import { AdminNav } from "@/components/admin/nav";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

export default function AdminLayout() {
  return (
    <SidebarProvider className="relative h-full min-h-0 flex-1 overflow-hidden">
      <AdminNav />
      <main className="flex-1 w-full overflow-auto flex flex-col relative">
        <div className="p-2">
          <SidebarTrigger />
        </div>
        <div className="flex-1">
          <Outlet />
        </div>
      </main>
    </SidebarProvider>
  );
}
