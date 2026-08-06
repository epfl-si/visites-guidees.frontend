import { callBackend } from "@/lib/api";
import type { guideInfo } from "@/types/guide";
import type { BackendResponse } from "@/types/api";

const VERSION = "v1"

export async function getGuideInfo(): Promise<BackendResponse<guideInfo[]>> {
  return await callBackend<guideInfo[]>(`${VERSION}/guides`);
}