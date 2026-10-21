import type { Language, LanguagesJson } from "@/types/language";

export type Place = {
  id: number;
  title: LanguagesJson;
  description: LanguagesJson;
  picture: string;
  capacity: number;
  price: number;
  conditions: LanguagesJson;
}

export type PlaceInformationType = Place & {
  languages: Language[];
};
