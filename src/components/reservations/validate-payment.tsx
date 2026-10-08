import { validatePayment } from "@/services/reservation";
import type { Reservation } from "@/types/reservation";
import { useState } from "react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";

export function ValidatePayment({
  reservation,
  updateReservation,
}: {
  reservation: Reservation,
  updateReservation: (reservation: Reservation) => void;
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { t } = useTranslation();

  const validate = async () => {
    if (isSubmitting) return;

    setIsSubmitting(true);
    validatePayment(reservation.id)
      .then((res) => {
        if (!res.success) {
          toast.error(t("reservation.handlePayment.errorValidate"));
          return;
        }
        updateReservation(res.data);
        toast.success(t("reservation.handlePayment.successValidate"))
      })
      .catch(() => {
        toast.error(t("reservation.handlePayment.errorValidate"))
      })
      .finally(() => setIsSubmitting(false))
  };

  return (
    <Card className="h-42 w-66">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard aria-hidden="true" className="h-5 w-5 text-purple-600"/>
          <p className="text-lg font-medium">
            {t("reservation.handlePayment.title")}
          </p>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4 mr-2">
        <p>
          {t("reservation.handlePayment.description")}
        </p>
        <div className="flex justify-between">
          <Button onClick={validate} className="w-20" disabled={isSubmitting}>
            {t("reservation.handlePayment.confirm")}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
