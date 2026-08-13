import { apiCall } from "@/lib/api";
import type { LastReservation } from "@/types/reservation";

const VERSION = "v1"

export async function postRegistration(
  data: Record<string, any>
) {
  const url = `${VERSION}/reservation/register`;
  if (!data) {
    throw new Error('Data is required to post registration');
  }
  return await apiCall(url, {
    method: 'POST',
    body: data
  });
}

export async function getLastReservations() {
  return await apiCall<LastReservation[]>(`${VERSION}/reservation/last`, {
    method: 'GET',
  })
}
