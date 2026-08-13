import type { LucideIcon } from "lucide-react";

export type ReservationStatus =
  | "WAITINGGUIDE"
  | "WAITINGVALIDATION"
  | "WAITINGPAYMENT"
  | "READY"
  | "CANCELLED";

export type StatusConfig = {
  icon: LucideIcon;
  labelKey: string;
  colorClass: string;
};
