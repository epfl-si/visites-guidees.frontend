import { useMemo } from "react";
import { Check } from "lucide-react";
import type { ReservationStatus, SnakeStatus } from "@/types/status";
import { useTranslation } from "react-i18next";
import { STATUS_ORDER } from "@/constants/status";
import type { ReservationStep } from "@/types/reservation";
import type { StepStatus } from "@/types/status";

export function SnakeStatus({ status }: { status: ReservationStatus }) {
  const { t } = useTranslation();

  const steps: ReservationStep[] = useMemo(() => {
    const currentIndex = STATUS_ORDER.lastIndexOf(status);
    return STATUS_ORDER.map((flowStatus, index) => {
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
        label: t(`reservation.status.${flowStatus.toLowerCase()}`),
        status: stepStatus,
      };
    })
  }, [status, t])

  return (
    <div className="w-full max-w-sm mx-auto p-10 flex flex-col">

      <div className="flex w-full">
        <div className="flex flex-col w-12 shrink-0 h-40">
          <div className="h-1/2 w-full border-t-4 border-l-4 border-emerald-600 rounded-tl-full relative">
            <div className="absolute -bottom-6 -left-5.5 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-600">
              <Check className="text-background h-7 w-7" />
            </div>
          </div>
          <div className="h-1/2 w-full border-b-4 border-l-4 border-accent rounded-bl-full" />
        </div>

        <div className="flex-1 border-t-4 border-emerald-600 relative">
          <div className="absolute -top-6 right-0 flex flex-col items-center translate-x-1/2">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-emerald-600">
              <Check className="text-background h-7 w-7" />
            </div>
            <p className="mt-2 text-sm font-medium whitespace-nowrap text-center">
              {t("reservation.steps.reserved")}
            </p>
          </div>
        </div>

        <div className="w-12 shrink-0" />
      </div>

      <div className="flex w-full -mt-1">
        <div className="w-12 shrink-0" />
        <div className="flex-1 border-t-4 border-accent" />
        <div className="flex flex-col w-12 shrink-0 h-40">
          <div className="h-1/2 w-full border-t-4 border-r-4 border-accent rounded-tr-full relative">
            <div className="absolute -bottom-6 -right-5.5 h-12 w-12 rounded-full bg-accent" />
          </div>
          <div className="h-1/2 w-full border-b-4 border-r-4 border-accent rounded-br-full" />
        </div>
      </div>

      <div className="flex w-full -mt-1">
        <div className="flex flex-col w-12 shrink-0 h-40">
          <div className="h-1/2 w-full border-t-4 border-l-4 border-accent rounded-tl-full relative">
            <div className="absolute -bottom-6 -left-5.5 h-12 w-12 rounded-full bg-accent" />
          </div>
          <div className="h-1/2 w-full border-b-4 border-l-4 border-accent rounded-bl-full" />
        </div>
        <div className="flex-1 border-t-4 border-accent" />
        <div className="w-12 shrink-0" />
      </div>

      <div className="flex w-full -mt-1">
        <div className="w-12 shrink-0" />
        <div className="flex-1 border-t-4 border-accent" />
        <div className="-bottom-6 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-600" />

      </div>
    </div>
  );
}
