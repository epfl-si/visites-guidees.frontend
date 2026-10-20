export type RegistrationPayloadType = {
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
  date: string,
  participantNumber: number,
  languageId: number,
  placeId: number,
  comment: string,
  gdprConsent: boolean,
}

export type LanguageType = {
  id: number;
  code: string;
  name: string;
};
