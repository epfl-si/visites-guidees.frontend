import type { LanguagesJson } from "./language";

export type BlockedPeriod = {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  label: LanguagesJson;
  start: Date;
  end: Date;
}
