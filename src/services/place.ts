import { callBackend } from "@/lib/api";
import type { Place } from "@/types/place";
import type { PlaceInformationType } from "@/types/place";
import type { BackendResponse } from "@/types/api";

const VERSION = "v1";
const ENDPOINT = "places";

export async function getPlaces(): Promise<BackendResponse<Place[]>> {
  const response = await callBackend<Place[]>(`${VERSION}/${ENDPOINT}`, {
    method: 'GET',
  });
  return response;
}

export async function getPlaceById(placeId: number) {
  const response = await callBackend<PlaceInformationType>(`${VERSION}/${ENDPOINT}/${placeId}`, {
    method: 'GET',
  });
  if (!response.success) {
    throw new Error("Failed to fetch place details");
  }
  return response.data;
}
