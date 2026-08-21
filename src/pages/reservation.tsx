import type { Reservation } from "@/types/reservation";
import type { ReservationStatus } from "@/types/status";
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router";
import { useTranslation } from "react-i18next";
import {
  ArrowLeft,
  Calendar,
  EllipsisVertical,
  Mail,
  Phone,
  User,
  Building,
  MapPin,
  Users,
  CalendarClock,
  CreditCard,
  Languages
} from "lucide-react";

import { getReservation } from "@/services/reservation";

import { LoadingPage } from "./Loading";
import { Empty, EmptyHeader, EmptyDescription, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";

import { RESERVATION_STATUS } from "@/constants/status";
import { cn } from "@/lib/utils";
import { Language } from "@/types/language";

function formatDateTime(d: Date | string) {
  return new Date(d).toLocaleDateString("fr-CH", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatDateOnly(d: Date | string) {
  return new Date(d).toLocaleDateString("fr-CH", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

export default function Reservation() {
  const [reservation, setReservation] = useState<Reservation>();
  const [language, setLanguage] = useState<Language>();
  const [loading, setLoading] = useState<boolean>(true);
  const [isPending, setIsPending] = useState<boolean>(false);

  const { id } = useParams();
  const { t } = useTranslation();

  useEffect(() => {
    const fetchReservation = async (reservationId: number) => {
      setLoading(true);
      try {
        const data = await getReservation(reservationId);
        setReservation(data);

        const lang = await getLanguage(data.languageId);
      } catch (error) {
        console.error("Erreur de chargement", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchReservation(Number(id));
    } else {
      setLoading(false);
    }
  }, [id]);

  if (loading) {
    return <LoadingPage />;
  }

  if (!reservation) {
    return (
      <div className="flex-1 p-8 w-full">
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <Calendar />
            </EmptyMedia>
            <EmptyTitle>{t("reservation.notFound")}</EmptyTitle>
            <EmptyDescription>
              {t("reservation.notFoundDescription")}
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      </div>
    );
  }

  const statusConfig = RESERVATION_STATUS[reservation.status];
  const StatusIcon = statusConfig?.icon || Calendar;

  return (
    <div className="flex-1 w-full overflow-auto">
      <div className="max-w-6xl mx-auto p-6 md:p-8 space-y-8">

        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="min-w-0 space-y-1.5">
            <div className="flex items-center gap-3">
              <Link
                to="/admin/reservation"
                className="text-muted-foreground hover:text-foreground transition-colors shrink-0"
              >
                <ArrowLeft className="h-5 w-5" />
              </Link>
              <h1 className="text-3xl font-semibold truncate leading-none">
                {t("reservation.orderNumber")} #{reservation.id}
              </h1>
            </div>
            <p className="text-sm text-muted-foreground ml-8">
              {t("reservation.createdAt")} {formatDateTime(reservation.createdAt)}
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0 ml-8 sm:ml-0">
            <div className={cn(
              "h-9 flex items-center gap-1.5 px-3 py-1 text-xs font-semibold border rounded-md bg-background shadow-sm",
              statusConfig?.colorClass
            )}>
              <StatusIcon className="h-4 w-4" />
              {t(statusConfig.labelKey)}
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger>
                <Button variant="outline" size="icon" disabled={isPending}>
                  <EllipsisVertical className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                {Object.entries(RESERVATION_STATUS).map(([key, config]) => {
                  const statusKey = key as ReservationStatus;
                  const Icon = config.icon;
                  return (
                    <DropdownMenuItem
                      key={statusKey}
                      disabled={statusKey === reservation.status}
                      className="gap-2 cursor-pointer"
                    >
                      <Icon className={cn("h-4 w-4", config.colorClass)} />
                      <span className={config.colorClass}>{t(config.labelKey)}</span>
                    </DropdownMenuItem>
                  );
                })}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div className="grid lg:grid-cols-5 gap-6">

          <div className="lg:col-span-3 space-y-6">

            <section className="space-y-3">
              <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                {t("reservation.visitDetails")}
              </h3>
              <div className="border border-border rounded-md divide-y divide-border bg-background shadow-sm">

                <div className="flex items-center gap-4 p-4">
                  <div className="h-12 w-12 rounded-md bg-secondary flex items-center justify-center shrink-0">
                    <CalendarClock className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-muted-foreground">{t("reservation.dateLabel")}</p>
                    <p className="font-medium text-base truncate">{formatDateOnly(reservation.date)}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4">
                  <div className="h-12 w-12 rounded-md bg-secondary flex items-center justify-center shrink-0">
                    <Users className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-muted-foreground">{t("reservation.participantsLabel")}</p>
                    <p className="font-medium text-base truncate">
                      {reservation.numberOfParticipant} {t("reservation.people")}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4">
                  <div className="h-12 w-12 rounded-md bg-secondary flex items-center justify-center shrink-0">
                    <Languages className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-muted-foreground">{t("reservation.languageLabel")}</p>
                    <p className="font-medium text-base truncate">
                      ID Langue: {reservation.languageId}
                    </p>
                  </div>
                </div>

              </div>
            </section>

            <section className="space-y-3">
              <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                {t("reservation.paymentInfo")}
              </h3>
              <div className="border border-border rounded-md p-4 bg-background shadow-sm flex items-start gap-3">
                <CreditCard className="h-5 w-5 text-muted-foreground mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs text-muted-foreground">{t("reservation.paymentMethod")}</p>
                  <p className="text-sm font-medium">{reservation.payment}</p>
                </div>
              </div>
            </section>

          </div>

          <div className="lg:col-span-2 space-y-6">

            <section className="space-y-3">
              <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                {t("reservation.customer")}
              </h3>
              <div className="border border-border rounded-md p-4 space-y-4 bg-background shadow-sm">

                <div className="flex items-start gap-3">
                  <User className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs text-muted-foreground">{t("reservation.name")}</p>
                    <p className="text-sm font-medium">{reservation.firstName} {reservation.lastName}</p>
                  </div>
                </div>

                {reservation.company && (
                  <div className="flex items-start gap-3">
                    <Building className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                    <div>
                      <p className="text-xs text-muted-foreground">{t("reservation.company")}</p>
                      <p className="text-sm font-medium">{reservation.company}</p>
                    </div>
                  </div>
                )}

                <div className="flex items-start gap-3">
                  <Mail className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs text-muted-foreground">{t("reservation.email")}</p>
                    <a href={`mailto:${reservation.email}`} className="text-sm font-medium text-blue-600 hover:underline">
                      {reservation.email}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs text-muted-foreground">{t("reservation.phone")}</p>
                    <a href={`tel:${reservation.phone}`} className="text-sm font-medium hover:underline">
                      {reservation.phone}
                    </a>
                  </div>
                </div>

              </div>
            </section>

            <section className="space-y-3">
              <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                {t("reservation.address")}
              </h3>
              <div className="border border-border rounded-md p-4 bg-background shadow-sm">
                <div className="flex items-start gap-3">
                  <MapPin className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                  <div className="space-y-1">
                    <p className="text-sm font-medium">{reservation.address}</p>
                    {reservation.additionnalAddress && (
                      <p className="text-sm text-muted-foreground">{reservation.additionnalAddress}</p>
                    )}
                    <p className="text-sm">
                      {reservation.zip} {reservation.city}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {reservation.region}, {reservation.country}
                    </p>
                  </div>
                </div>
              </div>
            </section>

          </div>
        </div>

      </div>
    </div>
  );
}
