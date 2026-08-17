import { apiCall } from "@/lib/api";
import type { Reservation, LastReservation } from "@/types/reservation";

const VERSION = "v1";
const ENDPOINT = "reservations";

export async function postRegistration(
  data: Record<string, any>
) {
  const url = `${VERSION}/${ENDPOINT}/register`;
  if (!data) {
    throw new Error('Data is required to post registration');
  }
  return await apiCall(url, {
    method: 'POST',
    body: data
  });
}

export async function getLastReservations() {
  return await apiCall<LastReservation[]>(`${VERSION}/${ENDPOINT}/?order=asc&limit=10`, {
    method: 'GET',
  });
}

export async function getReservations() {
  return await apiCall<Reservation[]>(`${VERSION}/${ENDPOINT}/`, {
    method: 'GET',
  });
}
