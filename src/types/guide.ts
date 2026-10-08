import type { GuideStatus } from "@/types/status";
import type { Language } from "@/types/language";
import type { User } from "@/types/user";
import type { Place } from "@/types/place";
import type { BlockedPeriod } from "@/types/blockedPeriod";

export type Guide = {
  id: number;
  status: GuideStatus;
  phone: string[];
  user: User;
  languages: Language[];
}

export type GuideDetails = Guide & {
  places: Omit<Place, "languages">[];
  blockedPeriods: BlockedPeriod[];
}

export type CreateGuide = {
  sciper: number;
  languageIds: number[];
  placeIds: number[];
  startDate: string;
}
