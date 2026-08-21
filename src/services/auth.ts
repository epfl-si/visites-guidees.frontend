import { callBackend } from "@/lib/api";
import type { BackendResponse } from "@/types/api";
import type { UserType } from "@/types/user";

const VERSION = "v1"

export async function fetchConnectedUser(): Promise<BackendResponse<UserType>> {
  return await callBackend<UserType>(`${VERSION}/users/me`);
}
