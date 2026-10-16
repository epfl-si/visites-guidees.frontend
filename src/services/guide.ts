import { callBackend } from "@/lib/api";
import type { CreateGuide, Guide } from "@/types/guide";
import type { BackendResponse } from "@/types/api";
import type { Reservation } from "@/types/reservation";
import type { BlockedPeriod } from "@/types/blockedPeriod";

const VERSION = "v1";
const ENDPOINT = "guides";

export async function getGuides(): Promise<BackendResponse<Guide[]>> {
  return await callBackend<Guide[]>(`${VERSION}/${ENDPOINT}`);
}

export const getGuide = async (sciper: number): Promise<BackendResponse<Guide>> => {
  return await callBackend<Guide>(`${VERSION}/${ENDPOINT}/${sciper}`)
}

export async function addGuide(guide: CreateGuide) {
  return await callBackend(`${VERSION}/${ENDPOINT}`, {
    method: "POST",
    body: guide,
  })
}

export async function getVisitsByGuide(guideId: number): Promise<BackendResponse<Reservation[]>> {
  return await callBackend<Reservation[]>(`${VERSION}/${ENDPOINT}/${guideId}/visits`);
}

export async function createBlockedPeriodForGuide(start: Date, end: Date): Promise<BackendResponse<BlockedPeriod>> {
  return await callBackend<BlockedPeriod>(`${VERSION}/${ENDPOINT}/absence`, {
    method: "POST",
    body: { start, end },
  });
}
