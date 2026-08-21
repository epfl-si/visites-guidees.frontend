import type { ReservationStatus } from "@/types/status";

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
  numberOfParticipant: number;
  status: ReservationStatus;
  languageId: number;
  placeId: number;
}

export type Reservations = {
  id: number;
  company: string;
  email: string;
  date: Date;
  status: ReservationStatus;
}
