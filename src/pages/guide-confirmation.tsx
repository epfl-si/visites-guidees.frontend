import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Spinner } from '@/components/ui/spinner';
import { getGuideInvitation, respondToInvitation } from '@/services/reservation';
import type { BackendResponseError } from '@/types/api';
import type { GuideInvitation, ReservationGuideAction } from '@/types/reservation';
import ErrorPage from "@/pages/Error"

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
  const navigate = useNavigate();
  const language = i18n.resolvedLanguage ?? 'en';

  const [invitation, setInvitation] = useState<GuideInvitation | null>(null);
  const [failed, setFailed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<{ code: number; message: string } | null>(null);
  const [pendingAction, setPendingAction] = useState<ReservationGuideAction | null>(null);

  const reservationId = Number(reservationIdParam);
  const hasValidId = Number.isInteger(reservationId) && reservationId > 0;

  useEffect(() => {
    if (!hasValidId) return;

    getGuideInvitation(reservationId)
      .then((res) => {
        if (!res.success) {
          const messageError = messageFor(res, 'errors.invitationLoad.title');
          toast.error(t(messageError));
          setFailed(true);
          setError({ code: res.code, message: messageError });
          return;
        }
        setInvitation(res.data);
      })
      .catch(() => {
        toast.error(t('errors.invitationLoad.title'));
        setFailed(true);
        setError({ code: 503, message: 'errors.invitationLoad.title' });
      });
  }, [hasValidId, reservationId, t]);

  if (!hasValidId) {
    return <ErrorPage errorCode={400} message="errors.invalidReservationId.title" />;
  }

  const respond = async (action: ReservationGuideAction) => {
    setIsSubmitting(true);
    try {
      const answer = await respondToInvitation(reservationId, action);
      if (!answer.success) {
        toast.error(t(messageFor(answer, 'guideConfirmation.submitError')));
        return;
      }

      toast.success(
        action === 'accept'
          ? t('guideConfirmation.acceptSuccess')
          : t('guideConfirmation.declineSuccess'),
      );
      navigate('/');
    } catch {
      toast.error(t('guideConfirmation.submitError'));
    } finally {
      setIsSubmitting(false);
      setPendingAction(null);
    }
  };

  if (!hasValidId || failed) {
    if (error) {
      return (
        <ErrorPage
          errorCode={error.code}
          message={error.message}
        />
      );
    }
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
  const placeTitle =
    reservation.place.title[language as keyof typeof reservation.place.title] ??
    reservation.place.title.en;

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
          <CardTitle>
            <h2>{placeTitle}</h2>
          </CardTitle>
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
        {status === 'WAITING' ? (
          <div className="flex flex-wrap gap-3">
            <Button onClick={() => setPendingAction('accept')} disabled={isSubmitting}>
              {t('guideConfirmation.actions.accept')}
            </Button>
            <Button
              variant="outline"
              onClick={() => setPendingAction('refuse')}
              disabled={isSubmitting}
            >
              {t('guideConfirmation.actions.decline')}
            </Button>
          </div>
        ) : (
          <p role="status" className={status === 'CHOSEN' ? 'text-epfl-canard' : undefined}>
            {t(`guideConfirmation.status.${status.toLowerCase()}`)}
          </p>
        )}
      </section>

      <Dialog
        open={pendingAction !== null}
        onOpenChange={(open) => {
          if (!open && !isSubmitting) setPendingAction(null);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {pendingAction === 'accept'
                ? t('guideConfirmation.confirm.acceptTitle')
                : t('guideConfirmation.confirm.declineTitle')}
            </DialogTitle>
            <DialogDescription>
              {pendingAction === 'accept'
                ? t('guideConfirmation.confirm.acceptDescription')
                : t('guideConfirmation.confirm.declineDescription')}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose
              render={
                <Button variant="outline" disabled={isSubmitting}>
                  {t('guideConfirmation.confirm.cancel')}
                </Button>
              }
            />
            <Button
              disabled={isSubmitting}
              onClick={() => {
                if (pendingAction) respond(pendingAction);
              }}
            >
              {isSubmitting
                ? t('guideConfirmation.actions.submitting')
                : t('guideConfirmation.confirm.confirm')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </article>
  );
}

function messageFor(
  error: BackendResponseError,
  fallbackKey: string,
): string {
  if (error.code === 403) return 'errors.guideNotActive.title';
  if (error.code === 404) return 'errors.notInvited.title';
  return fallbackKey;
}
