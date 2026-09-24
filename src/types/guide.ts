import type { GuideStatus } from "@/types/status";
import type { Language } from "@/types/language";
import type { User } from "@/types/user";

export type Guide = {
  id: number;
  status: GuideStatus;
  phone: string[];
  user: User;
  languages: Language[];
}

export type CreateGuide = {
  sciper: number;
  languageIds: number[];
  startDate: string;
}
