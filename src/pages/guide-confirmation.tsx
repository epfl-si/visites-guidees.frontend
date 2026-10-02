import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Spinner } from '@/components/ui/spinner';
import { getGuideInvitation, respondToInvitation } from '@/services/reservation';
import type { GuideInvitation } from '@/types/reservation';

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-0.5 sm:flex-row sm:justify-between sm:gap-4">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="font-medium sm:text-right">{value}</dd>
    </div>
  );
}

export default function GuideConfirmation() {
  const { reservationId: reservationIdParam } = useParams<{ reservationId: string }>();
  const { t, i18n } = useTranslation();
  const language = i18n.resolvedLanguage ?? 'en';

  const [invitation, setInvitation] = useState<GuideInvitation | null>(null);
  const [failed, setFailed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const reservationId = Number(reservationIdParam);
  const hasValidId = Number.isInteger(reservationId);

  useEffect(() => {
    if (!hasValidId) return;

    getGuideInvitation(reservationId)
      .then(setInvitation)
      .catch((error) => {
        console.error('getGuideInvitation Error', error);
        toast.error(t('guideConfirmation.loadError'));
        setFailed(true);
      });
  }, [hasValidId, reservationId, t]);

  const respond = async (status: 'ACCEPTED' | 'DECLINED') => {
    setIsSubmitting(true);
    try {
      const updated = await respondToInvitation(reservationId, status);
      setInvitation(updated);
      toast.success(
        status === 'ACCEPTED'
          ? t('guideConfirmation.acceptSuccess')
          : t('guideConfirmation.declineSuccess'),
      );
    } catch (error) {
      console.error('respondToInvitation Error', error);
      toast.error(t('guideConfirmation.submitError'));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!hasValidId || failed) {
    return (
      <article className="mx-auto w-full max-w-2xl px-4 py-10">
        <h1 className="mb-4 font-heading text-4xl font-bold tracking-tight">
          {t('guideConfirmation.title')}
        </h1>
        <p role="alert" className="text-epfl-accent">
          {t('guideConfirmation.loadError')}
        </p>
      </article>
    );
  }

  if (!invitation) {
    return (
      <article className="mx-auto w-full max-w-2xl px-4 py-10">
        <h1 className="mb-4 font-heading text-4xl font-bold tracking-tight">
          {t('guideConfirmation.title')}
        </h1>
        <p className="flex items-center gap-2 text-muted-foreground">
          <Spinner aria-label={t('guideConfirmation.loading')} />
          {t('guideConfirmation.loading')}
        </p>
      </article>
    );
  }

  const { reservation, status } = invitation;
  const visitDate = new Date(reservation.date);
  const placeTitle = reservation.place.title[language] ?? reservation.place.title.en;
  const hasAnswered = status === 'ACCEPTED' || status === 'DECLINED';

  return (
    <article className="mx-auto w-full max-w-2xl px-4 py-10">
      <header className="mb-8">
        <h1 className="font-heading text-4xl font-bold tracking-tight">
          {t('guideConfirmation.title')}
        </h1>
        <p className="mt-2 text-muted-foreground">
          {t('guideConfirmation.description')}
        </p>
      </header>

      <Card>
        <CardHeader>
          <CardTitle>{placeTitle}</CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="flex flex-col gap-3 text-sm">
            <DetailRow
              label={t('guideConfirmation.details.date')}
              value={visitDate.toLocaleDateString(language, {
                weekday: 'long',
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
            />
            <DetailRow
              label={t('guideConfirmation.details.time')}
              value={visitDate.toLocaleTimeString(language, {
                hour: '2-digit',
                minute: '2-digit',
              })}
            />
            <DetailRow
              label={t('guideConfirmation.details.participants')}
              value={String(reservation.participantNumber)}
            />
            <DetailRow
              label={t('guideConfirmation.details.language')}
              value={reservation.language.name}
            />
            {reservation.comment && (
              <DetailRow
                label={t('guideConfirmation.details.comment')}
                value={reservation.comment}
              />
            )}
          </dl>
        </CardContent>
      </Card>

      <section className="mt-8">
        {status === 'CHOSEN' && (
          <p role="status" className="text-epfl-canard">
            {t('guideConfirmation.status.chosen')}
          </p>
        )}

        {status === 'WAITING' && (
          <div className="flex flex-wrap gap-3">
            <Button onClick={() => respond('ACCEPTED')} disabled={isSubmitting}>
              {isSubmitting
                ? t('guideConfirmation.actions.submitting')
                : t('guideConfirmation.actions.accept')}
            </Button>
            <Button
              variant="outline"
              onClick={() => respond('DECLINED')}
              disabled={isSubmitting}
            >
              {t('guideConfirmation.actions.decline')}
            </Button>
          </div>
        )}

        {hasAnswered && (
          <div className="flex flex-col gap-3">
            <p role="status">
              {status === 'ACCEPTED'
                ? t('guideConfirmation.status.accepted')
                : t('guideConfirmation.status.declined')}
            </p>
          </div>
        )}
      </section>
    </article>
  );
}
