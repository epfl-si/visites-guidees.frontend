import type { Language } from "@/types/language";

export type Place = {
  id: number;
  title: placeJson;
  description: placeJson;
  picture: string;
  capacity: number;
  price: number;
  conditions: placeJson;
}

type placeJson = {
  en: string;
  fr: string;
}

export type PlaceInformationType = Place & {
  languages: Language[];
};
