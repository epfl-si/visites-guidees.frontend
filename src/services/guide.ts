import { apiCall } from "@/lib/api";
import type { guideInfo } from "@/types/guide";
import type { ResponseUserAPI } from "@/types/user";

export async function getGuideInfo(): Promise<guideInfo[]> {
  return await apiCall<guideInfo[]>("guide");
}

export async function searchUser(query: string): Promise<ResponseUserAPI[]> {
  return await apiCall<[]>(`user/search?query=${query}`);
}

export async function addGuide(sciper: number) {
  return await apiCall(`guide/add`, { "method": 'POST', "body": { "sciper": sciper } });
}