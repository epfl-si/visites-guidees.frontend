import { useMemo, useState, useEffect } from "react";
import { Check } from "lucide-react";
import type { ReservationStatus } from "@/types/status";
import { useTranslation } from "react-i18next";
import { STATUS_ORDER } from "@/constants/status";
import type { ReservationStep } from "@/types/reservation";
import type { StepStatus } from "@/types/status";
import { cn } from "@/lib/utils";
import { SVG, TOTAL_SVG_LENGTH, TARGET_DISTANCES } from "@/constants/workflow";

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
        label: t(`reservation.steps.${flowStatus.toLowerCase()}`),
        status: stepStatus,
      };
    });
  }, [status, t]);

  const currentIndex = STATUS_ORDER.lastIndexOf(status);
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
      <svg viewBox="0 0 400 600" className="absolute inset-0 z-0 h-full w-full overflow-visible">
        <path
          d={SVG}
          fill="none"
          stroke="#e5e7eb"
          strokeWidth="8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d={SVG}
          fill="none"
          stroke="#059669"
          strokeWidth="8"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray={TOTAL_SVG_LENGTH}
          strokeDashoffset={dashOffset}
          className="transition-all duration-1000 ease-in-out"
        />
      </svg>
      <div className="absolute inset-0 z-10 h-full w-full">

        <div className="absolute flex flex-col items-center -translate-x-1/2 -translate-y-1/2 left-84 top-12">
          <div className="relative z-10 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-600 text-white shadow-md">
            <Check className="h-7 w-7" />
          </div>
          <p className="absolute top-full mt-3 whitespace-nowrap text-center text-sm font-medium text-foreground">
            {t("reservation.steps.reserved")}
          </p>
        </div>

        <div className="absolute flex flex-col items-center -translate-x-1/2 -translate-y-1/2 left-12 top-32">
          <div className={cn(
            "relative z-10 flex h-12 w-12 items-center justify-center rounded-full transition-colors",
            steps[0].status === "success" && "bg-emerald-600 text-white",
            steps[0].status === "in-progress" && "bg-yellow-500 text-white shadow-md",
            steps[0].status === "pending" && "bg-accent text-muted-foreground"
          )}>
            {steps[0].status === "success" && <Check className="h-7 w-7" />}
            {steps[0].status === "in-progress" && <div className="h-4 w-4 animate-pulse rounded-full bg-white" />}
          </div>
          <p className="absolute top-full mt-3 whitespace-nowrap text-center text-sm font-medium">
            {steps[0]?.label}
          </p>
        </div>

        <div className="absolute flex flex-col items-center -translate-x-1/2 -translate-y-1/2 left-84 top-70">
          <div className={cn(
            "relative z-10 flex h-12 w-12 items-center justify-center rounded-full transition-colors",
            steps[1].status === "success" && "bg-emerald-600 text-white",
            steps[1].status === "in-progress" && "bg-yellow-500 text-white shadow-md",
            steps[1].status === "pending" && "bg-accent text-muted-foreground"
          )}>
            {steps[1].status === "success" && <Check className="h-7 w-7" />}
            {steps[1].status === "in-progress" && <div className="h-4 w-4 animate-pulse rounded-full bg-white" />}
          </div>
          <p className="absolute top-full mt-3 whitespace-nowrap text-center text-sm font-medium">
            {steps[1]?.label}
          </p>
        </div>

        <div className="absolute flex flex-col items-center -translate-x-1/2 -translate-y-1/2 left-12 top-108">
          <div className={cn(
            "relative z-10 flex h-12 w-12 items-center justify-center rounded-full transition-colors",
            steps[2].status === "success" && "bg-emerald-600 text-white",
            steps[2].status === "in-progress" && "bg-yellow-500 text-white shadow-md",
            steps[2].status === "pending" && "bg-accent text-muted-foreground"
          )}>
            {steps[2].status === "success" && <Check className="h-7 w-7" />}
            {steps[2].status === "in-progress" && <div className="h-4 w-4 animate-pulse rounded-full bg-white" />}
          </div>
          <p className="absolute top-full mt-3 whitespace-nowrap text-center text-sm font-medium">
            {steps[2]?.label}
          </p>
        </div>

        <div className="absolute flex flex-col items-center -translate-x-1/2 -translate-y-1/2 left-84 top-127">
          <div className={cn(
            "relative z-10 flex h-12 w-12 items-center justify-center rounded-full transition-colors",
            steps[3].status === "success" && "bg-emerald-600 text-white",
            steps[3].status === "in-progress" && "bg-yellow-500 text-white shadow-md",
            steps[3].status === "pending" && "bg-accent text-muted-foreground"
          )}>
            {steps[3].status === "success" && <Check className="h-7 w-7" />}
            {steps[3].status === "in-progress" && <div className="h-4 w-4 animate-pulse rounded-full bg-white" />}
          </div>
          <p className="absolute top-full mt-3 whitespace-nowrap text-center text-sm font-medium">
            {steps[3]?.label}
          </p>
        </div>

      </div>
    </div>
  );
}
