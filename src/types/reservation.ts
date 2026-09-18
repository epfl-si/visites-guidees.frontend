import type { ReservationStatus } from "@/types/status";
import type { Language } from "@/types/language";
import type { Guide } from "@/types/guide";
import type { Place } from "@/types/place";
import type { StepStatus } from "@/types/status";

export type Reservation = {
  id: number;
  firstName: string;
  lastName: string;
  company: string;
  email: string;
  phone: string;
  address: string;
  additionnalAddress: string;
  city: string;
  zip: number;
  region: string;
  country: string;
  date: string;
  createdAt: Date;
  payment: string;
  participantNumber: number;
  status: ReservationStatus;
  language: Language;
  place: Place
  reservationGuides: { guide: Guide }[];
}

export type Reservations = {
  id: number;
  company: string;
  email: string;
  date: Date;
  status: ReservationStatus;
}

export type ReservationStep = {
  status: StepStatus;
  label: string;
  reservationStatus: ReservationStatus;
};
