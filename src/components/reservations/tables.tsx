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
import { Loader2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { RESERVATION_STATUS } from "@/constants/status";
import { Skeleton } from "@/components/ui/skeleton";

export const Reservations = ({ reservations, loading }: { reservations: Reservation[], loading : boolean }) => {
  const { t } = useTranslation()

  return (
    <Card className="">
      <CardHeader>
        <CardTitle>
          Last reservations
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center p-8">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : reservations.length === 0 ? (
          <p className="p-4 text-center text-muted-foreground">
            {t("errors.dataloading.defaultMessage")}
          </p>
        ) : (
        <div className="rounded-md border">
          <Table className="">
            <TableHeader>
              <TableRow>
                <TableHead>Company</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
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
              ) :reservations.map((reservation) => {
                const statusConfig = RESERVATION_STATUS[reservation.status];
                if (!statusConfig) return null;
                const StatusIcon = statusConfig.icon;

                return(
                <TableRow key={reservation.id}>
                  <TableCell>
                    {reservation.company}
                  </TableCell>
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
                )
              })}
            </TableBody>
          </Table>
        </div>
        )}
      </CardContent>
    </Card>
  );
};
