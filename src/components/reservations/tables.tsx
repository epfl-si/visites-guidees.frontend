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

export const Reservations = ({ reservations }: { reservations: LastReservation[] }) => {
  if (!reservations || reservations.length === 0) {
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
      </CardContent>
    </Card>
  );
};
