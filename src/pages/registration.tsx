import RegistrationForm from '@/components/registration/form';
import { useParams } from 'react-router';
import type { PlaceInformationType } from "@/types/place"
import { useState,useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { getPlaceById } from '@/services/place';
import { toast } from "sonner";
import type { Languages } from '@/types/language';

export default function Registration() {
  const { placeId: placeIdString } = useParams<{ placeId: string }>();
  const [visitInformation, setVisitInformation] = useState<PlaceInformationType|null>(null);

  const { t, i18n } = useTranslation();
  const currentLanguage = i18n.resolvedLanguage as Languages;
  const placeId = Number(placeIdString);

  useEffect(() => {
    if (!Number.isInteger(placeId)) return;

    getPlaceById(placeId)
      .then(setVisitInformation)
      .catch(() => {
        toast.error(t("registration.loadError"));
      });
  }, [placeId, t]);

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
