export type RegistrationFormType = {
  firstName: string,
  lastName: string,
  company: string,
  email: string,
  phone: string,
  address: string,
  additionalAddress: string,
  city: string,
  region: string,
  zip: string,
  country: string,
  visitDate: string,
  visitTime: string,
  participantNumber: number,
  languageId: number,
  comment: string,
  gdprConsent: boolean,
}

type Translated = {
  [langCode: string]: string;
};

export type LanguageType = {
  id: number;
  code: string;
  name: string;
};

export type PlaceListItemType = {
  id: number;
  title: Translated;
  description: Translated;
  picture: string;
  capacity: number;
  price: number;
  conditions: Translated;
  createdAt: string;
  updatedAt: string;
};

export type PlaceInformationType = PlaceListItemType & {
  languages: LanguageType[];
};
