import { callBackend } from "@/lib/api";
import type { PlaceInformationType, PlaceListItemType } from "@/types/register";

const VERSION = "v1"

export async function getPlaces() {
  const response = await callBackend<PlaceListItemType[]>(`${VERSION}/places`, {
    method: 'GET',
  });
  if (!response.success) {
    throw new Error(`Failed to fetch visit details`);
  }
  return response.data;
}

export async function getPlaceById(placeId: number) {
  const response = await callBackend<PlaceInformationType>(`${VERSION}/places/${placeId}`, {
    method: 'GET',
  });
  if (!response.success) {
    throw new Error("Failed to fetch place details");
  }
  return response.data;
}
