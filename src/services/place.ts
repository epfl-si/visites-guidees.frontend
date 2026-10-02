import { callBackend } from "@/lib/api";
import type { Place } from "@/types/place";
import type { PlaceInformationType } from "@/types/place";
import type { BackendResponse } from "@/types/api";

const VERSION = "v1";
const ENDPOINT = "places";

export async function getPlaces(includeLanguages: true): Promise<BackendResponse<PlaceInformationType[]>>;
export async function getPlaces(includeLanguages?: false): Promise<BackendResponse<Place[]>>;
export async function getPlaces(includeLanguages = false): Promise<BackendResponse<Place[] | PlaceInformationType[]>> {
  return callBackend<Place[] | PlaceInformationType[]>(
    `${VERSION}/${ENDPOINT}${includeLanguages ? '?includeLanguage=true' : ''}`,
    {method: 'GET'},
  );
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
