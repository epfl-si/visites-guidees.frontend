import { useMemo, useState, useEffect } from "react";
import { Check, CircleX } from "lucide-react";
import { useTranslation } from "react-i18next";
import { STATUS_ORDER } from "@/constants/status";
import type { Reservation, ReservationStep } from "@/types/reservation";
import type { StepStatus } from "@/types/status";
import { cn } from "@/lib/utils";
import { SVG, TOTAL_SVG_LENGTH, TARGET_DISTANCES, COORDINATES } from "@/constants/workflow";
import { Empty, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { Card } from "@/components/ui/card";
import { ValidatePayment } from "@/components/reservations/validate-payment";

export function SnakeStatus({
  reservation,
  updateReservation,
}: {
  reservation: Reservation,
  updateReservation: (reservation: Reservation) => void;
}) {
  const { t } = useTranslation();
  const currentIndex = STATUS_ORDER.indexOf(reservation.status);

  const steps: ReservationStep[] = useMemo(() => {
    const positiveStatuses = STATUS_ORDER.filter(s => s !== "CANCELLED");
    return positiveStatuses.map((flowStatus, index) => {
      let stepStatus: StepStatus = "pending";

      if (index < currentIndex) {
        stepStatus = "success";
      } else if (index === currentIndex) {
        stepStatus = "in-progress";
        if (index === STATUS_ORDER.length - 1) {
          stepStatus = "success";
        }
      }

      return {
        reservationStatus: flowStatus,
        label: t(`reservation.steps.${flowStatus.toLowerCase()}`),
        status: stepStatus,
      };
    });
  }, [t, currentIndex]);

  const targetDistance = currentIndex === -1 ? 0 : TARGET_DISTANCES[currentIndex] ?? 0;
  const [dashOffset, setDashOffset] = useState(TOTAL_SVG_LENGTH);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDashOffset(TOTAL_SVG_LENGTH - targetDistance);
    }, 100);
    return () => clearTimeout(timeout);
  }, [targetDistance]);

  return (
    <div className="relative mx-auto my-10 w-full max-w-sm aspect-4/6">
      {reservation.status === "CANCELLED" ? (
        <Card>
          <Empty>
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <CircleX className="text-epfl-red"/>
              </EmptyMedia>
              <EmptyTitle>This reservation is canceled</EmptyTitle>
            </EmptyHeader>
          </Empty>
        </Card>
      ) : (
        <div>
          <svg viewBox="0 0 400 600" className="absolute inset-0 z-0 h-full w-full overflow-visible">
            <path d={SVG} fill="none" stroke="#e5e7eb" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
            <path
            d={SVG} fill="none" stroke="#FFb3b3" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round"
            strokeDasharray={TOTAL_SVG_LENGTH}
            strokeDashoffset={dashOffset}
            className="transition-all duration-1000 ease-in-out"
            />
          </svg>

          <div className="absolute inset-0 z-10 h-full w-full">
            <div className="absolute flex flex-col items-center -translate-x-1/2 -translate-y-1/2 left-87.5 top-12">
              <div className="relative z-10 flex h-12 w-12 items-center justify-center rounded-full bg-epfl-red text-white">
                <Check className="h-7 w-7" />
              </div>
              <p className="absolute top-full mt-3 whitespace-nowrap text-center text-sm font-medium text-foreground">
                {t("reservation.steps.reserved")}
              </p>
            </div>

            {steps.map((step, i) => (
              <div
                key={i}
                className="absolute flex flex-col items-center -translate-x-1/2 -translate-y-1/2"
                style={{ left: COORDINATES[i].left, top: COORDINATES[i].top }}
              >
                <div className={cn(
                  "relative z-10 flex h-12 w-12 items-center justify-center rounded-full transition-colors",
                  step.status === "success" && "bg-epfl-red text-white",
                  step.status === "in-progress" && "bg-white text-white border-epfl-red border-3 border-dashed",
                  step.status === "pending" && "bg-accent text-muted-foreground"
                )}>
                  {step.status === "success" && <Check className="h-7 w-7" />}
                  {step.status === "in-progress" && <div className="h-3 w-3 animate-pulse rounded-full bg-epfl-red" />}
                </div>

                <div className={cn(
                  "absolute text-sm font-medium leading-tight",
                  i === steps.length - 1
                  ? "top-full mt-3 left-1/2 -translate-x-1/2 whitespace-nowrap text-center text-foreground"
                  : cn(
                      "top-1/2 -translate-y-1/2 w-32",
                      i % 2 === 0 ? "left-full ml-4 text-left" : "right-full mr-4 text-right"
                    )
                )}>
                  <span className="block">{step.label}</span>
                  {step.reservationStatus === "WAITINGPAYMENT" && reservation.status === "WAITINGPAYMENT" && (
                    <div className="absolute top-1/2 -translate-y-1/2 w-68 right-full mr-20">
                      <ValidatePayment
                        reservation={reservation}
                        updateReservation={updateReservation}
                      />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
