import { modifyStatusReservation } from "@/services/reservation"
import { Card } from "@/components/ui/card";
import { Button } from "../ui/button";

export function HandlePayment({ reservationId }: { reservationId: number }) {

  const handlePayment = async () => {
    await modifyStatusReservation(reservationId, "READY");
  }

  return (
    <Card>
      <Button onClick={handlePayment}>
        Confirm Payment
      </Button>
    </Card>
  )
}
