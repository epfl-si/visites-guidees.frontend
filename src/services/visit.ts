import { callBackend } from "@/lib/api";
import type { Place } from "@/types/place";
import type { BackendResponse } from "@/types/api";

const VERSION = "v1"

export async function fetchVisitTitle(
  placeId: number | undefined
): Promise<BackendResponse<Place>> {
  const url = `${VERSION}/place/${placeId}`;
  if (!placeId) {
    throw new Error('placeId is required to fetch visit title');
  }

  return await callBackend<Place>(url, {
    method: 'GET',
  });
}
