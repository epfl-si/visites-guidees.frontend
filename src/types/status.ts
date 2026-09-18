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

export type GuideStatus =
  | "ACTIVE"
  | "INACTIVE"
  | "SUSPENDED"
  | "RETIRED";

export type SnakeStatus =
  | "SUCCESS"
  | "PENDING"
  | "IN_PROGRESS"
  | "CANCEL"

export type StepStatus = "success" | "in-progress" | "pending";
