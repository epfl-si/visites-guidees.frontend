import type { language } from "./language";
import type { UserType } from "./user";

export type guideInfo = {
  id: number
  user: UserType & { email: string },
  phone: string,
  languages: language[]
};
