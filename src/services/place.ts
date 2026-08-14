import { apiCall } from "@/lib/api";
import type { Place } from "@/types/place";

const VERSION = "v1";
const ENDPOINT = "places";

export async function getPlaces() {
  return await apiCall<Place[]>(`${VERSION}/${ENDPOINT}`, {
    method: 'GET',
  });
}
