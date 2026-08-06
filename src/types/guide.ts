import type { language } from "./language";

export type guideInfo = {
  id: number,
  firstName: string,
  lastName: string,
  email: string,
  phone: string,
  languages: language[]
};