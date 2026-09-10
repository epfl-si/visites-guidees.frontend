import { Calendar, LayoutPanelLeft, User } from "lucide-react";
import { NavLink } from "react-router";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";

export function AdminNav() {
  const { t } = useTranslation();

  const NAV_ITEMS = [
    { href: "/admin", label: t("admin.nav.dashboard"), Icon: LayoutPanelLeft },
    { href: "/admin/reservation", label: t("admin.nav.reservations"), Icon: Calendar },
    { href: "/admin/guide", label: t("admin.nav.guides"), Icon: User },
  ];

  return (
    <nav className="space-y-0.5 w-64 shrink-0 border-r-2 p-8">
      {NAV_ITEMS.map(({ href, label, Icon }) => {

        const isActive = href === "/admin"
          ? location.pathname === "/admin" || location.pathname == "/admin/"
          : location.pathname.startsWith(href);
        return (
          <NavLink
            key={href}
            to={href}
            end={href === "/admin"}
            className={cn(
              "flex items-center gap-2 px-3 py-2 text-sm rounded-sm transition-colors",
              isActive
                ? "bg-secondary text-foreground font-medium"
                : "text-muted-foreground hover:bg-secondary hover:text-foreground",
            )}
          >
            <Icon className="h-4 w-4 shrink-0" />
            {label}
          </NavLink>
        )
      })}
    </nav>
  );
}
