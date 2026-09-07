import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ContentCard } from '@/components/cards/ContentCard';
import { Spinner } from '@/components/ui/spinner';
import { getPlaces } from '@/services/place';
import type { Place } from '@/types/place';
import { toast } from "sonner"

export default function Page() {
  const { t, i18n } = useTranslation();
  const lang = i18n.resolvedLanguage === 'fr' ? 'fr' : 'en';
  const [places, setPlaces] = useState<Place[] | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    getPlaces()
      .then((res) => {
        if (res.success) setPlaces(res.data);
      })
      .catch(() => {
        toast.error(t('app.tours.error'));
        setFailed(true);
      });
  }, [t]);

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
                className="h-full max-w-none"
                content={{
                  id: place.id,
                  picture: place.picture,
                  title: place.title[lang] || place.title.en,
                  description: place.description[lang] || place.description.en,
                }}
                />
            </li>
          ))}
        </ul>
      )}
    </article>
  );
}
