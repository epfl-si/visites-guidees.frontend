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
    <nav aria-label={t("admin.nav.label")} className="space-y-0.5 w-64 shrink-0 border-r-2 p-8">
      <ul className="space-y-0.5">
        {NAV_ITEMS.map(({ href, label, Icon }) => (
          <li key={href}>
            <NavLink
              to={href}
              end={href === "/admin"}
              className={({ isActive }) => cn(
                "flex items-center gap-2 px-3 py-2 text-sm rounded-sm transition-colors",
                "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
                isActive
                  ? "bg-secondary text-foreground font-medium"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground",
              )}
            >
              <Icon aria-hidden="true" className="h-4 w-4 shrink-0" />
              {label}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
