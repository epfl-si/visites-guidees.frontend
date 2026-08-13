import type { ReservationStatus, StatusConfig } from "@/types/status";
import {
  UserSearch,
  FileClock,
  CreditCard,
  CheckCircle2,
  XCircle
} from "lucide-react";

export const RESERVATION_STATUS: Record<ReservationStatus, StatusConfig> = {
  WAITINGGUIDE: {
    icon: UserSearch,
    labelKey: "reservation.status.WAITINGGUIDE",
    colorClass: "text-blue-600",
  },
  WAITINGVALIDATION: {
    icon: FileClock,
    labelKey: "reservation.status.WAITINGVALIDATION",
    colorClass: "text-amber-600",
  },
  WAITINGPAYMENT: {
    icon: CreditCard,
    labelKey: "reservation.status.WAITINGPAYMENT",
    colorClass: "text-purple-600",
  },
  READY: {
    icon: CheckCircle2,
    labelKey: "reservation.status.READY",
    colorClass: "text-emerald-600",
  },
  CANCELLED: {
    icon: XCircle,
    labelKey: "reservation.status.CANCELLED",
    colorClass: "text-red-600",
  },
};
