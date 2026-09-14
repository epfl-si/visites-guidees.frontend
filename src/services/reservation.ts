import { callBackend } from "@/lib/api";
import type { RegistrationFormType } from "@/types/register";
import type { Reservation, GuideInvitation, ReservationGuideStatus } from "@/types/reservation";

const VERSION = "v1";
const ENDPOINT = "reservations";

export async function postRegistration(
  data: Record<string, any>
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

export async function getGuideInvitation(reservationId: number) {
  const response = await callBackend<GuideInvitation>(
    `${VERSION}/reservations/${reservationId}/invitation`,
  );
  if (!response.success) {
    throw new Error("Failed to fetch guide invitation");
  }
  return response.data;
}

export async function respondToInvitation(
  reservationId: number,
  status: Extract<ReservationGuideStatus, "ACCEPTED" | "DECLINED">,
) {
  const response = await callBackend<GuideInvitation>(
    `${VERSION}/reservations/${reservationId}/invitation`,
    { method: 'PATCH', body: { status } },
  );
  if (!response.success) {
    throw new Error("Failed to submit the guide answer");
  }
  return response.data;
}
