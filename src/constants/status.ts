import type { GuideStatus, ReservationStatus, StatusConfig } from "@/types/status";
import {
  UserSearch,
  FileClock,
  CreditCard,
  CheckCircle2,
  XCircle,
  CircleCheck,
  CircleDashed,
  CircleSlash2,
  Hourglass
} from "lucide-react";

export const RESERVATION_STATUS: Record<ReservationStatus, StatusConfig> = {
  WAITINGGUIDE: {
    icon: UserSearch,
    labelKey: "reservation.status.WAITINGGUIDE",
    colorClass: "text-indigo-600",
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

export const GUIDE_STATUS: Record<GuideStatus, StatusConfig> = {
  ACTIVE: {
    icon: CircleCheck,
    labelKey: "guide.status.ACTIVE",
    colorClass: "text-emerald-600",
  },
  INACTIVE: {
    icon: CircleDashed,
    labelKey: "guide.status.INACTIVE",
    colorClass: "text-gray-600",
  },
  RETIRED: {
    icon: CircleSlash2,
    labelKey: "guide.status.RETIRED",
    colorClass: "text-red-600"
  },
  SUSPENDED: {
    icon: Hourglass,
    labelKey: "guide.status.SUSPENDED",
    colorClass: "text-amber-600"
  }
}
