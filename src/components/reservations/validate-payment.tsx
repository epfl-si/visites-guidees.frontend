import { cancelReservation, validatePayment } from "@/services/reservation";
import type { Reservation } from "@/types/reservation";
import { useState } from "react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ValidatePayment({
  reservation,
  updateReservation,
}: {
  reservation: Reservation,
  updateReservation: (reservation: Reservation) => void;
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = async () => {
    if (isSubmitting) return;

    setIsSubmitting(true);
    validatePayment(reservation.id)
      .then((res) => {
        if (!res.success) {
          toast.error("Failed to validate payment");
          return;
        }
        updateReservation(res.data);
        toast.success("The payment of reservation has been validate successfully")
      })
      .catch(() => {
        toast.error("Failed to validate payment")
      })
      .finally(() => setIsSubmitting(false))
  };

  const cancel = async () => {
    if (isSubmitting) return;

    setIsSubmitting(true);
    cancelReservation(reservation.id)
      .then((res) => {
        if (!res.success) {
          toast.error("Failed to cancel reservation")
          return;
        }
        updateReservation(res.data);
        toast.success("This reservation has been canceled successfully");
      })
      .catch(() => toast.error("Failed to cancel reservation"))
      .finally(() => setIsSubmitting(false))
  }

  return (
    <Card className="h-42 w-60">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard aria-hidden="true" className="h-5 w-5 text-purple-600"/>
          <p className="text-lg font-medium">
            Validate payment
          </p>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-3 mr-2">
        <p>
          Would you confirm the payment ?
        </p>
        <div className="flex justify-between">
          <Button onClick={cancel} variant="destructive" className="w-19" disabled={isSubmitting}>
            Cancel
          </Button>
          <Button onClick={validate} className="w-19" disabled={isSubmitting}>
            Confirm
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
