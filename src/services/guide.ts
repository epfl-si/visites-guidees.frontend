import { callBackend } from "@/lib/api";
import type { Guide } from "@/types/guide";
import type { BackendResponse } from "@/types/api";

const VERSION = "v1";
const ENDPOINT = "guides";

export async function getGuides(): Promise<BackendResponse<Guide[]>> {
  return await callBackend<Guide[]>(`${VERSION}/${ENDPOINT}`);
}

export async function addGuide(sciper: number) {
  return await callBackend(`${VERSION}/${ENDPOINT}`, { "method": 'POST', "body": { "sciper": sciper } });
}
