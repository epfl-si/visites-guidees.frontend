import { callBackend } from "@/lib/api"
import type { BackendResponse } from "@/types/api"
import type { ListLanguage } from "@/types/language"

const VERSION = "v1"
const ENDPOINT = "languages"

export async function getLanguages(): Promise<BackendResponse<ListLanguage[]>> {
  return await callBackend<ListLanguage[]>(`${VERSION}/${ENDPOINT}`)
}

export async function removeLanguage(id: number): Promise<BackendResponse<ListLanguage>> {
  return await callBackend<ListLanguage>(`${VERSION}/${ENDPOINT}/${id}`, {
    method: "DELETE",
  });
}

export async function restoreLanguage(id: number): Promise<BackendResponse<ListLanguage>> {
  return await callBackend<ListLanguage>(`${VERSION}/${ENDPOINT}/${id}`, {
    method: 'PUT',
    body: {

    }
  })
}
