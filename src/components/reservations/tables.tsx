import type { reservations } from "@/types/reservation";
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

export const Reservations = ({ reservations, isLoading }: { reservations: reservations[], isLoading : boolean }) => {
  const { t } = useTranslation()

  return (
    <Card className="">
      <CardHeader>
        <CardTitle>
          Last reservations
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
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
              {reservations.map((reservation) => (
                <TableRow key={reservation.id}>
                  <TableCell>
                    {reservation.company}
                  </TableCell>
                  <TableCell>{reservation.email}</TableCell>
                  <TableCell>{new Date(reservation.visitDate).toLocaleDateString ()}</TableCell>
                  <TableCell>
                    {reservation.status.status}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        )}
      </CardContent>
    </Card>
  );
};
