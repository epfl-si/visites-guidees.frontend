import { apiCall } from "@/lib/api";
import type { Guide } from "@/types/guide";

const VERSION = "v1";
const ENDPOINT = "guides";

export async function getGuides() {
  return await apiCall<Guide[]>(`${VERSION}/${ENDPOINT}`, {
    method: 'GET',
  });
}
