import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ContentCard } from '@/components/cards/ContentCard';
import { Spinner } from '@/components/ui/spinner';
import { getPlaces } from '@/services/visit';
import type { ContentCardType } from '@/types/content-card';
import type { PlaceListItemType } from '@/types/register';

function toCardContent(
  place: PlaceListItemType,
  language: string,
): ContentCardType {
  return {
    id: place.id,
    picture: place.picture,
    title: place.title[language] ?? place.title.en,
    description: place.description[language] ?? place.description.en,
  };
}

export default function Page() {
  const { t, i18n } = useTranslation();
  const language = i18n.resolvedLanguage ?? 'en';
  const [places, setPlaces] = useState<PlaceListItemType[] | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    getPlaces()
      .then(setPlaces)
      .catch((error) => {
        console.error('getPlaces Error', error);
        setFailed(true);
      });
  }, []);

  return (
    <article id="guided-tours" className="mx-auto w-full max-w-5xl px-4 py-10">
      <header className="mb-10">
        <h1 className="font-heading text-4xl font-bold tracking-tight">
          {t('app.title')}
        </h1>
        <p className="mt-4 max-w-3xl text-lg text-muted-foreground">
          {t('app.description')}
        </p>
      </header>

      {failed && (
        <p role="alert" className="text-epfl-accent">
          {t('app.tours.error')}
        </p>
      )}

      {!failed && places === null && (
        <p className="flex items-center gap-2 text-muted-foreground">
          <Spinner aria-label={t('app.tours.loading')} />
          {t('app.tours.loading')}
        </p>
      )}

      {places?.length === 0 && (
        <p className="text-muted-foreground">{t('app.tours.empty')}</p>
      )}

      {places && places.length > 0 && (
        <ul id="guided-tours-list" className="grid gap-8 sm:grid-cols-2">
          {places.map((place) => (
            <li key={place.id}>
              <ContentCard
                content={toCardContent(place, language)}
                className="h-full max-w-none"
              />
            </li>
          ))}
        </ul>
      )}
    </article>
  );
}
