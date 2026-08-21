import { apiCall } from "@/lib/api";
import type { Guide } from "@/types/guide";
import type { ResponseUserAPI } from "@/types/user";

export async function getGuides(): Promise<Guide[]> {
  return await apiCall<Guide[]>("guide");
}

export async function searchUser(query: string): Promise<ResponseUserAPI[]> {
  return await apiCall<[]>(`user/search?query=${query}`);
}

export async function addGuide(sciper: number) {
  return await apiCall(`guide/add`, { "method": 'POST', "body": { "sciper": sciper } });
}
