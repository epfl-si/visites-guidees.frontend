import { callBackend } from "@/lib/api";
import type { BackendResponse } from "@/types/api";
import type { RegistrationFormType } from "@/types/register";
import type {
  Reservation,
  GuideInvitation,
  ReservationGuideAction,
} from "@/types/reservation";

const VERSION = "v1";
const ENDPOINT = "reservations";

export async function postRegistration(
  data: Record<string, any>
): Promise<BackendResponse<RegistrationFormType>> {
  const url = `${VERSION}/${ENDPOINT}/`;
  if (!data) {
    throw new Error('Data is required to post registration');
  }
  return await callBackend<RegistrationFormType>(url, {
    method: 'POST',
    body: data
  });
}

export async function getReservations(limit: number | undefined = undefined, order: "asc" | "desc" | undefined = undefined): Promise<BackendResponse<Reservation[]>> {
  const params = new URLSearchParams();
  if (limit) params.set('limit', String(limit));
  if (order) params.set('order', order);

  const parameter = params.size ? `?${params.toString()}` : '';

  return await callBackend<Reservation[]>(`${VERSION}/${ENDPOINT}${parameter}`)
}

export async function getReservation(reservationId: number): Promise<BackendResponse<Reservation>> {
  return await callBackend<Reservation>(`${VERSION}/${ENDPOINT}/${reservationId}`, {
    method: "GET",
  })
}

export async function getGuideInvitation(
  reservationId: number,
): Promise<BackendResponse<GuideInvitation>> {
  return await callBackend<GuideInvitation>(
    `${VERSION}/${ENDPOINT}/${reservationId}/invitation`,
  );
}

export async function respondToInvitation(
  reservationId: number,
  action: ReservationGuideAction,
): Promise<BackendResponse<void>> {
  return await callBackend<void>(
    `${VERSION}/${ENDPOINT}/${reservationId}/${action}`,
    { method: 'POST' },
  );
}
