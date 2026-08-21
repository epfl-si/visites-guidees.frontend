import { callBackend } from "@/lib/api";
import type { BackendResponse } from "@/types/api";
import type { ResponseUserAPI } from "@/types/user";

const VERSION = "v1";
const ENDPOINT = "users";

export async function searchUser(query: string): Promise<BackendResponse<ResponseUserAPI[]>> {
  return await callBackend<[]>(`${VERSION}/${ENDPOINT}/search?query=${query}`);
}
