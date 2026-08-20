import type { Reservation } from "@/types/reservation"
import { useEffect, useState } from "react";
import { Empty, EmptyHeader, EmptyDescription, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { ArrowLeft, Calendar, Search } from "lucide-react";
import { getReservations } from "@/services/reservation";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useTranslation } from "react-i18next";
import { RESERVATION_STATUS } from "@/constants/status";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Link, useNavigate } from "react-router";

export default function Reservations() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [inputSearch, setInputSearch] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");

  const navigate = useNavigate();

  const { t } = useTranslation();

  useEffect(() => {
    const fetchReservations = async () => {
      const data = await getReservations();
      setReservations(data);
    }
    fetchReservations();
  }, []);

  const searchReservations = (reservation: Reservation, searchQuery: string) => {
    if (!searchQuery) return true;

    const query = searchQuery.toLowerCase().trim();

    const matchInValues = Object.values(reservation).some((value) => {
      if (value === null || value === undefined) return false;
      return String(value).toLowerCase().includes(query);
    });

    let matchInTranslatedStatus = false;
    const statusConfig = RESERVATION_STATUS[reservation.status as keyof typeof RESERVATION_STATUS];

    if (statusConfig) {
      const translatedStatus = t(statusConfig.labelKey).toLowerCase();
      matchInTranslatedStatus = translatedStatus.includes(query);
    }

    return matchInValues || matchInTranslatedStatus;
  };

  const filteredReservations = reservations.filter((reservation) => {
    const matchSearch = searchReservations(reservation, inputSearch);

    const matchStatus = statusFilter === "ALL" || reservation.status === statusFilter;

    return matchSearch && matchStatus;
  });

  const getSelectedLabel = () => {
    if (statusFilter === "ALL") return t("reservation.allStatus");

    const config = RESERVATION_STATUS[statusFilter as keyof typeof RESERVATION_STATUS];
    return config ? t(config.labelKey) : statusFilter;
  };


  if (reservations.length === 0) {
    return (
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
      </Empty >
    )
  }

  return (
    <>
      <div className="flex-1 p-8 overflow-auto w-full mr-10">
        <div className="flex items-center gap-3 h-10 mb-8">
          <Link to="/admin" className="text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="h-5 w-5"/>
          </Link>
          <h2 className="text-2xl font-bold">{t("reservation.title")}</h2>
        </div>
        <div className="flex flex-col gap-6">
          <div className="flex gap-4">
            <div className="relative flex-1 flex items-center">
              <Search className="absolute left-3 h-4 w-4 text-muted-foreground pointer-events-none shrink-0" />
              <input
                type="search"
                value={inputSearch}
                onChange={(e) => setInputSearch(e.target.value)}
                placeholder={t("table.search", "Search a reservation")}
                className="h-9 w-full border border-input bg-background pl-9 pr-3 text-sm outline-none focus:ring-1 focus:ring-ring placeholder:text-muted-foreground"
              />
            </div>

            <Select
              value={statusFilter}
              onValueChange={(val) => setStatusFilter(val ?? "ALL")}
            >
              <SelectTrigger className="w-50 h-9 shrink-0 bg-background">
                <SelectValue placeholder={t("table.filterStatus", "Filtrer par statut")}>
                  {getSelectedLabel()}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">
                  {t("reservation.allStatus")}
                </SelectItem>
                {Object.entries(RESERVATION_STATUS).map(([key, config]) => (
                  <SelectItem key={key} value={key}>
                    {t(config.labelKey)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

      <Table className="border border-border bg-background">
        <TableHeader>
          <TableRow className="bg-muted/50">
            <TableHead>{t("table.company")}</TableHead>
            <TableHead>{t("table.email")}</TableHead>
            <TableHead>{t("table.date")}</TableHead>
            <TableHead>{t("table.status")}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredReservations.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                {t("reservation.noResults")}
              </TableCell>
            </TableRow>
          ) : (

            filteredReservations.map((reservation) => {
              const statusConfig = RESERVATION_STATUS[reservation.status];
              if (!statusConfig) return null;
              const StatusIcon = statusConfig.icon;
              return (
                <TableRow
                  key={reservation.id}
                  onClick={() => navigate(reservation.id.toString())}
                  className="hover:cursor-pointer"
                >
                  <TableCell className="font-medium">{reservation.company ?? "-"}</TableCell>
                    <TableCell>{reservation.email}</TableCell>
                    <TableCell>{new Date(reservation.date).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <div className={`flex items-center gap-2 ${statusConfig.colorClass}`}>
                        <StatusIcon className="w-4 h-4" />
                        <span className="text-sm font-medium">
                          {t(statusConfig.labelKey)}
                        </span>
                      </div>
                    </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
          </Table>
        </div>
      </div>
    </>
  )
}
