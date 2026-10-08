import { callBackend } from "@/lib/api";
import type { CreateGuide, Guide, GuideDetails } from "@/types/guide";
import type { BackendResponse } from "@/types/api";

const VERSION = "v1";
const ENDPOINT = "guides";

export async function getGuides(): Promise<BackendResponse<Guide[]>> {
  return await callBackend<Guide[]>(`${VERSION}/${ENDPOINT}`);
}

export const getGuide = async (sciper: number): Promise<BackendResponse<GuideDetails>> => {
  return await callBackend<GuideDetails>(`${VERSION}/${ENDPOINT}/${sciper}`)
}

export async function addGuide(guide: CreateGuide) {
  return await callBackend(`${VERSION}/${ENDPOINT}`, {
    method: "POST",
    body: guide,
  })
}
