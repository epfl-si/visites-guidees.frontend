import { useMemo } from "react";
import { Check } from "lucide-react";
import type { ReservationStatus, SnakeStatus } from "@/types/status";
import { useTranslation } from "react-i18next";
import { STATUS_ORDER } from "@/constants/status";
import type { ReservationStep } from "@/types/reservation";
import type { StepStatus } from "@/types/status";
import { cn } from "@/lib/utils";

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

  return (
    <div className="w-full max-w-sm mx-auto p-10 flex flex-col">

      <div className="flex w-full">
        <div className="flex flex-col w-12 shrink-0 h-40">
          <div className="h-1/2 w-full border-t-4 border-l-4 border-emerald-600 rounded-tl-full relative">
            <div
              className={
                cn("absolute -bottom-6 -left-6.5 flex h-12 w-12 items-center justify-center rounded-full",
                  steps[0].status === "success" && "bg-emerald-600 text",
                  steps[0].status === "in-progress" && "bg-yellow-600",
                  steps[0].status === "pending" && "bg-accent text-muted-foreground"
                )
              }
            >
              {steps[0].status === "success" && (
                <Check className="h-7 w-7 text-background" />
              )}
              {steps[0].status === "in-progress" && (
                <div className="h-4 w-4 rounded-full bg-white animate-pulse" />
              )}

              <p className="absolute left-1/2 top-full mt-2 -translate-x-1/2 whitespace-nowrap text-center text-sm font-medium">
                {steps[0]?.label}
              </p>
            </div>
          </div>
          <div className={cn("h-1/2 w-full border-b-4 border-l-4 rounded-bl-full",
            steps[1].status !== "pending"
              ? "border-emerald-600"
              : "border-accent"
          )} />
        </div>

        <div className={cn("relative flex-1 border-t-4",
          steps[0].status !== "pending"
          ? "border-emerald-600"
          : "border-accent"
      )}>
          <div className="absolute -top-6 right-0 flex h-12 w-12 translate-x-1/2 items-center justify-center rounded-full bg-emerald-600">
            <Check className="h-7 w-7 text-background" />
            <p className="absolute left-1/2 top-full mt-2 -translate-x-1/2 whitespace-nowrap text-center text-sm font-medium">
              {t("reservation.steps.reserved")}
            </p>
          </div>
        </div>

        <div className="w-12 shrink-0" />
      </div>

      <div className="flex w-full -mt-1">
        <div className="w-12 shrink-0" />
        <div className={cn("flex-1 border-t-4",
          steps[1].status !== "pending"
          ? "border-emerald-600"
          : "border-accent"
        )} />
        <div className="flex flex-col w-12 shrink-0 h-40">
          <div className={cn("h-1/2 w-full border-t-4 border-r-4 rounded-tr-full relative",
            steps[1].status !== "pending"
              ? "border-emerald-600"
              : "border-accent"
          )}>
            <div
              className={
                cn("absolute -bottom-6 -right-6.5 flex h-12 w-12 items-center justify-center rounded-full",
                  steps[1].status === "success" && "bg-emerald-600 text",
                  steps[1].status === "in-progress" && "bg-yellow-600",
                  steps[1].status === "pending" && "bg-accent text-muted-foreground"
                )
              }
            >
              {steps[1].status === "success" && (
                <Check className="h-7 w-7 text-background" />
              )}
              {steps[1].status === "in-progress" && (
                <div className="h-4 w-4 rounded-full bg-white animate-pulse" />
              )}
              <p className="absolute left-1/2 top-full mt-2 -translate-x-1/2 whitespace-nowrap text-center text-sm font-medium">
                {steps[1]?.label}
              </p>
            </div>
          </div>
          <div className={cn("h-1/2 w-full border-b-4 border-r-4 rounded-br-full",
            steps[2].status !== "pending"
              ? "border-emerald-600"
              : "border-accent"
          )} />
        </div>
      </div>

      <div className="flex w-full -mt-1">
        <div className="flex flex-col w-12 shrink-0 h-40">
          <div className={cn("h-1/2 w-full border-t-4 border-l-4 rounded-tl-full relative",
            steps[2].status !== "pending"
              ? "border-emerald-600"
              : "border-accent"
          )}>
            <div
              className={
                cn("absolute -bottom-6 -left-5.5 flex h-12 w-12 items-center justify-center rounded-full",
                  steps[2].status === "success" && "bg-emerald-600 text",
                  steps[2].status === "in-progress" && "bg-yellow-600",
                  steps[2].status === "pending" && "bg-accent text-muted-foreground"
                )
              }
            >
              {steps[2].status === "success" && (
                <Check className="h-7 w-7 text-background" />
              )}
              {steps[2].status === "in-progress" && (
                <div className="h-4 w-4 rounded-full bg-white animate-pulse" />
              )}
              <p className="absolute left-1/2 top-full mt-2 -translate-x-1/2 whitespace-nowrap text-center text-sm font-medium">
                {steps[2]?.label}
              </p>
            </div>
          </div>
          <div
            className={cn("h-1/2 w-full border-b-4 border-l-4 rounded-bl-full",
              steps[3].status !== "pending"
              ? "border-emerald-600"
              : "border-accent"
            )} />
        </div>
        <div className={cn("flex-1 border-t-4",
          steps[2].status !== "pending"
            ? "border-emerald-600"
            : "border-accent"
          )} />
        <div className="w-12 shrink-0" />
      </div>

      <div className="flex w-full -mt-1">
        <div className="w-12 shrink-0" />
        <div className={cn("relative flex-1 border-t-4",
          steps[3].status !== "pending"
            ? "border-emerald-600"
            : "border-accent"
          )}>
          <div
            className={
              cn("absolute -top-6 right-0 flex h-12 w-12 translate-x-1/2 items-center justify-center rounded-full",
                steps[3].status === "success" && "bg-emerald-600 text",
                steps[3].status === "in-progress" && "bg-yellow-600",
                steps[3].status === "pending" && "bg-accent text-muted-foreground"
              )
            }
          >
            {steps[3].status === "success" && (
              <Check className="h-7 w-7 text-background" />
            )}
            {steps[3].status === "in-progress" && (
              <div className="h-4 w-4 rounded-full bg-white animate-pulse" />
            )}
            <p className="absolute left-1/2 top-full mt-2 -translate-x-1/2 whitespace-nowrap text-center text-sm font-medium">
              {steps[3]?.label}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
