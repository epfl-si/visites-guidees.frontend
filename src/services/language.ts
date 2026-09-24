import { callBackend } from "@/lib/api"
import type { BackendResponse } from "@/types/api"
import type { Language } from "@/types/language"

const VERSION = 1

export async function getLanguages(): Promise<BackendResponse<Language[]>> {
  return await callBackend<Language[]>(`v${VERSION}/languages`)
}
