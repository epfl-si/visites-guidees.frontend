import { Header } from "@/components/Header.tsx";
import { Footer } from "@/components/Footer.tsx";
import { Outlet } from "react-router";
import type { UserType } from "@/types/user";
import type { State } from "@epfl-si/react-appauth";
import { Toaster } from "@/components/ui/sonner"
import { useTranslation } from "react-i18next";

export const AppLayout = ({ user, oidc }: { user: UserType, oidc: State }) => {
  const { t } = useTranslation()
  return (
    <div className="flex flex-col min-h-screen">
      <title>{t("app.title")}</title>
      <Header user={user} onLogin={() => oidc.login()} onLogout={() => oidc.logout()}/>
      <Toaster position="bottom-center" />
      <main id="main-content" className="w-full mx-auto flex-1 flex flex-col">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
