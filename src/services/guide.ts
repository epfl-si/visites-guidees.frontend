import { callBackend } from "@/lib/api";
import type { guideInfo } from "@/types/guide";
import type { BackendResponse } from "@/types/api";
import type { ResponseUserAPI } from "@/types/user";

const VERSION = "v1"

export async function getGuideInfo(): Promise<BackendResponse<guideInfo[]>> {
  return await callBackend<guideInfo[]>(`${VERSION}/guides`);
}

export async function searchUser(query: string): Promise<BackendResponse<ResponseUserAPI[]>> {
  return await callBackend<[]>(`${VERSION}/users/search?query=${query}`);
}

export async function addGuide(sciper: number) {
  return await callBackend(`${VERSION}/guides`, { "method": 'POST', "body": { "sciper": sciper } });
}