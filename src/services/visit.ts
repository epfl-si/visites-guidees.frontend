import { apiCall } from "@/lib/api";

const VERSION = "v1"

export async function fetchVisitTitle(
  placeId: number | undefined
): Promise<string> {
  const url = `${VERSION}/place/${placeId}`;
  if (!placeId) {
    throw new Error('placeId is required to fetch visit title');
  }

  return await apiCall(url, {
    method: 'GET',
  });
}
