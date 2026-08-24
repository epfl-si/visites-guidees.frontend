import { Header } from "@/components/Header.tsx";
import { Footer } from "@/components/Footer.tsx";
import { Outlet } from "react-router";
import type { UserType } from "@/types/user";
import type { State } from "@epfl-si/react-appauth";
import { Toaster } from "@/components/ui/sonner"

export const AppLayout = ({ user, oidc }: { user: UserType, oidc: State }) => {
  return (
    <main className="flex flex-col min-h-screen">
      <Header user={user} onLogin={() => oidc.login()} onLogout={() => oidc.logout()}/>
      <Toaster position="bottom-center" />
      <div className="w-full mx-auto flex-1 flex flex-col">
        <Outlet />
      </div>

      <Footer />
    </main>
  );
}
