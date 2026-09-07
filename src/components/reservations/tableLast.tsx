import type { Reservation } from "@/types/reservation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { RESERVATION_STATUS } from "@/constants/status";
import { useTranslation } from 'react-i18next';
import { Link } from "react-router";
import { Skeleton } from "@/components/ui/skeleton";

export const LastReservationsTable = ({ lastReservations, loading }: { lastReservations: Reservation[], loading: boolean }) => {
  const { t } = useTranslation();

  if (!loading && (!lastReservations)) {
    return <p className="text-center text-muted-foreground p-4">{t("reservation.notFound")}</p>;
  }

  return (
    <Card className="">
      <CardHeader>
        <CardTitle>
          <Link to="/admin/reservation" className="hover:text-destructive hover:underline">
            {t("reservation.lastReservations")}
          </Link>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table className="">
            <TableHeader>
              <TableRow>
                <TableHead>{t("table.company")}</TableHead>
                <TableHead>{t("table.email")}</TableHead>
                <TableHead>{t("table.date")}</TableHead>
                <TableHead>{t("table.status")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                Array.from({ length: 5 }).map((_, index) => (
                  <TableRow key={index}>
                    <TableCell><Skeleton className="h-4 w-30" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-45" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-25" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-27.5"/></TableCell>
                  </TableRow>
                ))
              ) : lastReservations.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                    {t("reservation.notFound")}
                  </TableCell>
                </TableRow>
              ) : (
                lastReservations.map((reservation) => {
                  const statusConfig = RESERVATION_STATUS[reservation.status];
                  if (!statusConfig) return null;
                  const StatusIcon = statusConfig.icon;

                  return (
                    <TableRow key={reservation.id}>
                      <TableCell>{reservation.company ?? "-"}</TableCell>
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
      </CardContent>
    </Card>
  );
};
