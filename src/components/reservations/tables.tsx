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
import { useTranslation } from "react-i18next";
import { RESERVATION_STATUS } from "@/constants/status";
import { Skeleton } from "@/components/ui/skeleton";

export const Reservations = ({ reservations, loading, error }: { reservations: Reservation[], loading: boolean, error: boolean }) => {
  const { t } = useTranslation();

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("reservation.title")}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-1/4">Company</TableHead>
                <TableHead className="w-1/4">Email</TableHead>
                <TableHead className="w-1/4">Date</TableHead>
                <TableHead className="w-1/4">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                Array.from({ length: 5 }).map((_, index) => (
                  <TableRow key={index}>
                    <TableCell><Skeleton className="h-4 w-30" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-45" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-25" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-27" /></TableCell>
                  </TableRow>
                ))
              ) : error ? (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    className="h-66.25 text-center text-muted-foreground"
                  >
                    {t("admin.reservations.loadError")}
                  </TableCell>
                </TableRow>
              ) : reservations.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    className="h-66.25 text-center text-muted-foreground"
                  >
                    {t("admin.reservations.notFound")}
                  </TableCell>
                </TableRow>
              ) : reservations.map((reservation) => {
                const statusConfig = RESERVATION_STATUS[reservation.status];
                if (!statusConfig) return null;
                const StatusIcon = statusConfig.icon;
                return (
                  <TableRow key={reservation.id}>
                    <TableCell>{reservation.company}</TableCell>
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
              })}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};
