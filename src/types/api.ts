import type { UserType } from "@/types/user";

export type ApiResponse<T> = {
  success: boolean;
  data: T | null;
  timestamp: string;
  requestId: string;
}

export type FetchUserType = {
  status?: number;
  data?: UserType;
  errors?: any;
};
