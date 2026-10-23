export type Language = {
  id: number;
  code: string;
  name: string;
  deletedAt: Date | null;
}

export interface ListLanguage extends  Language {
  _count: {
    reservations: number;
    guides: number;
    places: number;
  }
}

export type Languages = "en" | "fr";
