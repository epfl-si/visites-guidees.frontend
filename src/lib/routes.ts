const REGISTRATION_SEGMENT = {
  en: "register",
  fr: "inscription",
} as const;

export const registrationSegments = Object.values(REGISTRATION_SEGMENT);

export function registrationPath(placeId: number, language: string) {
  const segment =
    REGISTRATION_SEGMENT[language as keyof typeof REGISTRATION_SEGMENT]
    ?? REGISTRATION_SEGMENT.en;
  return `/${placeId}/${segment}`;
}
