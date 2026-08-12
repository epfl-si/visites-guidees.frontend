import RegistrationForm from '@/components/registration/form';
import { useParams } from 'react-router';
import type { UserType } from "@/types/user";
import type { PlaceInformationType } from "@/types/register"
import type {State} from "@epfl-si/react-appauth";
import { useState,useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { env } from '@/lib/env';


export default function Registration({ user: _user, oidc:_oidc }: { user: UserType, oidc: State }) {
  const { placeId: placeIdString } = useParams<{ placeId: string }>();
  const [visitInformation, setVisitInformation] = useState<PlaceInformationType|null>(null);

  const {t,  i18n } = useTranslation();
  const currentLanguage:any = i18n.language;
  // TODO: to retrieve the title of the visite from the backend with the idVisit
  useEffect(() => {
    if (!placeIdString) return;

    const fetchVisit = async () => {
      try {
        const response = await fetch(
          `${env().VITE_GUIDED_TOURS_BACKEND_URL}place/${placeIdString}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch visit details");
        }

        const data: PlaceInformationType = await response.json();
        setVisitInformation(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchVisit();
  }, [placeIdString]);

  if (!placeIdString || !visitInformation) {
    return null;
  }
  const lengthOfCondition:number = visitInformation.conditions[currentLanguage].length
  const pluralHandlingCondition = lengthOfCondition == 1 ? "registration.condition.label":"registration.condition.plural"

  return (
    <div className="flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold">{visitInformation?.title[currentLanguage]}</h1>
      {lengthOfCondition > 0 && (
        <>
        <h2 className='text-2xl font-bold'>{t(pluralHandlingCondition)}</h2>
        <ul className='list-inside w-full max-w-md m-2'>
          {visitInformation.conditions[currentLanguage].map((condition,index) => (
            <li className="list-disc" key={index}>{condition}</li>
          ))}
        </ul>
        </>
      )}
      <RegistrationForm  information={visitInformation} />
    </div>
  );
}
