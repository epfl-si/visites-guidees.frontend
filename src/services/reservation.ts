import { callBackend } from "@/lib/api";
import type { RegistrationFormType } from "@/types/register";
import type { Reservation } from "@/types/reservation";
import type { ReservationStatus } from "@/types/status";

const VERSION = "v1";
const ENDPOINT = "reservations";

export async function postRegistration(
  data: RegistrationFormType
) {
  const url = `${VERSION}/${ENDPOINT}/`;
  if (!data) {
    throw new Error('Data is required to post registration');
  }
  return await callBackend<RegistrationFormType>(url, {
    method: 'POST',
    body: data
  });
}

export async function getReservations(limit: number | undefined = undefined, order: "asc" | "desc" | undefined = undefined) {
  const params = new URLSearchParams();
  if (limit) params.set('limit', String(limit));
  if (order) params.set('order', order);

  const parameter = params.size ? `?${params.toString()}` : '';

  return await callBackend<Reservation[]>(`${VERSION}/${ENDPOINT}${parameter}`)
}

export async function getReservation(reservationId: number) {
  return await callBackend<Reservation>(`${VERSION}/${ENDPOINT}/${reservationId}`, {
    method: "GET",
  })
}

export async function modifyStatusReservation(reservationId: number, status: ReservationStatus) {
  return await callBackend<Reservation>(`${VERSION}/${ENDPOINT}/${reservationId}`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  })
}
