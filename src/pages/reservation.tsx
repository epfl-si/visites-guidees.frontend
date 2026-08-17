import type { Reservation } from "@/types/reservation"
import { useEffect, useState } from "react";
import { Empty, EmptyHeader, EmptyDescription, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { Calendar, Search } from "lucide-react";
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

export default function Reservation() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [inputSearch, setInputSearch] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");

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

    return Object.values(reservation).some((value) => {
      if (value === null || value === undefined) return false;

      return String(value).toLowerCase().includes(query);
    });
  };

  const filteredReservations = reservations.filter((reservation) => {
      const matchSearch = searchReservations(reservation, inputSearch);

      const matchStatus = statusFilter === "ALL" || reservation.status === statusFilter;

      return matchSearch && matchStatus;
    });

  const getSelectedLabel = () => {
      if (statusFilter === "ALL") return t("table.allStatuses", "Tous les statuts");

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
          <EmptyTitle>No reservation found</EmptyTitle>
          <EmptyDescription>
            Currently nobody have reserve a guided tour.
          </EmptyDescription>
        </EmptyHeader>
      </Empty >
    )
  }

  return (
    <>
      <div className="flex-1 p-8 overflow-auto w-full mr-10">
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
                  {t("table.allStatuses", "Tous les statuts")}
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
                {t("table.noResults", "Aucun résultat pour cette recherche.")}
              </TableCell>
            </TableRow>
          ) : (

            filteredReservations.map((reservation) => {
              const statusConfig = RESERVATION_STATUS[reservation.status];
              if (!statusConfig) return null;
              const StatusIcon = statusConfig.icon;
              return (
                <TableRow key={reservation.id}>
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
