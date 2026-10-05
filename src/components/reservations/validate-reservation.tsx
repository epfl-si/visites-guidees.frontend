import { useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { UserCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { validateReservation } from "@/services/reservation";
import type { Reservation } from "@/types/reservation";

export function ValidateReservation({
  reservation,
  onValidated,
}: {
  reservation: Reservation;
  onValidated: (updated: Reservation) => void;
}) {
  const { t } = useTranslation();
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const accepted = reservation.reservationGuides.filter(
    (assignment) => assignment.status === "ACCEPTED",
  );

  const requiredGuides = Math.max(
    1,
    Math.ceil(reservation.participantNumber / reservation.place.capacity),
  );

  const toggle = (guideId: number, checked: boolean) => {
    setSelectedIds((current) =>
      checked
        ? [...current, guideId]
        : current.filter((id) => id !== guideId),
    );
  };

  const validate = async () => {
    if (selectedIds.length === 0) return;

    setIsSubmitting(true);
    try {
      const answer = await validateReservation(reservation.id, selectedIds);
      if (!answer.success) {
        toast.error(t("reservation.validate.error"));
        return;
      }
      toast.success(t("reservation.validate.success"));
      onValidated(answer.data);
    } catch {
      toast.error(t("reservation.validate.error"));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <h2 className="flex items-center gap-2">
            <UserCheck aria-hidden="true" className="h-5 w-5" />
            {t("reservation.validate.title")}
          </h2>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {accepted.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            {t("reservation.validate.noneAccepted")}
          </p>
        ) : (
          <div className="flex flex-col gap-4">
            <p className="text-sm text-muted-foreground">
              {t("reservation.validate.description", {
                count: requiredGuides,
              })}
            </p>

            <fieldset className="flex flex-col gap-2">
              <legend className="sr-only">
                {t("reservation.validate.legend")}
              </legend>
              {accepted.map((assignment) => (
                <Label
                  key={assignment.guide.id}
                  className="flex items-center gap-2 font-normal"
                >
                  <Checkbox
                    checked={selectedIds.includes(assignment.guide.id)}
                    onCheckedChange={(checked) =>
                      toggle(assignment.guide.id, checked === true)
                    }
                  />
                  {assignment.guide.user.firstName} {assignment.guide.user.lastName}
                </Label>
              ))}
            </fieldset>
            <p
              className={
                selectedIds.length < requiredGuides
                  ? "text-sm text-epfl-carotte"
                  : "text-sm text-muted-foreground"
              }
            >
              {t("reservation.validate.selectedCount", {
                selected: selectedIds.length,
                required: requiredGuides,
              })}
            </p>

            <Button
              className="self-start"
              onClick={validate}
              disabled={selectedIds.length === 0 || isSubmitting}
            >
              {isSubmitting
                ? t("reservation.validate.submitting")
                : t("reservation.validate.confirm")}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
