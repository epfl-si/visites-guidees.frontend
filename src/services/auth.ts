import { apiCall } from "@/lib/api";
import type { UserType } from "@/types/user";

const VERSION = "v1"

export async function fetchConnectedUser(): Promise<UserType> {
  return await apiCall<UserType>(`${VERSION}/users/me`);
}
