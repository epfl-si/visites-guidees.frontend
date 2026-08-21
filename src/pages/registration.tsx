import RegistrationForm from '@/components/registration/form';
import { useParams } from 'react-router';
import type { UserType } from "@/types/user";
import type { PlaceInformationType } from "@/types/register"
import type {State} from "@epfl-si/react-appauth";
import { useState,useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { getPlaceById } from '@/services/visit';

export default function Registration({ user: _user, oidc:_oidc }: { user: UserType, oidc: State }) {
  const { placeId: placeIdString } = useParams<{ placeId: string }>();
  const [visitInformation, setVisitInformation] = useState<PlaceInformationType|null>(null);

  const { t, i18n } = useTranslation();
  const currentLanguage = i18n.resolvedLanguage ?? 'en';
  const placeId = Number(placeIdString);

  useEffect(() => {
    if (!Number.isInteger(placeId)) return;

    getPlaceById(placeId)
      .then(setVisitInformation)
      .catch((error) => console.error('getPlaceById Error', error));
  }, [placeId]);

  if (!Number.isInteger(placeId) || !visitInformation) {
    return null;
  }
  const condition = visitInformation.conditions[currentLanguage] ?? visitInformation.conditions.en

  return (
    <div className="flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold">{visitInformation.title[currentLanguage] ?? visitInformation.title.en}</h1>
      {condition && (
        <>
        <h2 className='text-2xl font-bold'>{t("registration.condition.label")}</h2>
        <p className='w-full max-w-md m-2'>{condition}</p>
        </>
      )}
      <RegistrationForm  information={visitInformation} />
    </div>
  );
}
