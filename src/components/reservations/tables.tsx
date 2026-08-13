import type { LastReservation } from "@/types/reservation";
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

export const LastReservationsTable = ({ lastReservations }: { lastReservations: LastReservation[] }) => {
  const { t } = useTranslation();

  if (!lastReservations || lastReservations.length === 0) {
    return <p className="text-center text-muted-foreground p-4">Aucune réservation trouvée.</p>;
  }

  return (
    <Card className="">
      <CardHeader>
        <CardTitle>
          Last reservations
        </CardTitle>
      </CardHeader>
      <CardContent>
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
              {lastReservations.map((reservation) => {
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
              })}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};
