import { fetchConnectedUser } from "@/services/auth"
import { getGuide, getVisitsByGuide } from "@/services/guide";
import type { Guide } from "@/types/guide";
import { useEffect, useState } from "react"
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";
import { NextVisitCard } from "@/components/guide/visitCard";
import { toast } from "sonner";
import { format } from "date-fns";
import {
  Calendar as IconCalendar,
  MapPin,
  Activity,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { Reservation } from "@/types/reservation";
import { Skeleton } from "@/components/ui/skeleton";
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from "@/components/ui/carousel";
import type { Languages } from "@/types/language";
import { ScrollArea } from "@/components/ui/scroll-area";
import { BlockedPeriodFormGuide } from "@/components/blockedPeriod/formGuide";
import { fr } from "date-fns/locale"

export default function GuideDashboard() {
  const { t, i18n } = useTranslation();
  const currentLanguage = i18n.resolvedLanguage as Languages;
  const navigate = useNavigate();

  const [loadingGuide, setLoadingGuide] = useState<boolean>(true);
  const [loadingVisits, setLoadingVisits] = useState<boolean>(true);
  const [errorVisits, setErrorVisits] = useState<boolean>(false);
  const [guide, setGuide] = useState<Guide | null>(null);
  const [visits, setVisits] = useState<Reservation[]>([]);

  useEffect(() => {
    const fetchGuide = async () => {
      try {
        const user = await fetchConnectedUser();
        if (user.success) {
          const guideRes = await getGuide(Number(user.data.sciper));
          if (guideRes.success) {
            setGuide(guideRes.data);
            return;
          }
        }
        navigate("/");
      } catch {
        toast.error(t("guide.dashboard.fetchError"));
        navigate("/");
      } finally {
        setLoadingGuide(false);
      }
    };

    fetchGuide();
  }, [t, navigate]);

  useEffect(() => {
    const fetchVisits = async () => {
      if (guide) {
        getVisitsByGuide(guide.id)
          .then((res) => {
            if (res.success) {
              const sortedVisits = res.data.sort((a, b) =>
                new Date(a.date).getTime() - new Date(b.date).getTime()
              );
              setVisits(sortedVisits);
            }
          })
          .catch(() => {
            setErrorVisits(true)
          })
          .finally(() => {
            setLoadingVisits(false);
          });
      }
    };
    fetchVisits();
  }, [guide]);

  return (
    <div className="flex-1 flex-col overflow-y-auto bg-muted/10 p-8">

      <div className="mb-8 flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight flex items-center">
          {t("guide.dashboard.welcome")},{" "}
          {guide && !loadingGuide ? (
            <span className="ml-2">
              {guide?.user.firstName} {guide?.user.lastName}
            </span>
          ) : (
            <Skeleton className="h-8 w-40 ml-2" />
          )}
        </h1>
        <p className="text-muted-foreground">
          Voici un résumé de votre activité et de vos prochaines visites.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Visites à venir</CardTitle>
            <IconCalendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loadingVisits ? (
              <Skeleton className="h-8 w-12" />
            ) : (
              <div className="text-2xl font-bold">{visits.length}</div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Langues actives</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loadingGuide ? (
              <Skeleton className="h-8 w-12 mb-1" />
            ) : (
              <>
                <div className="text-2xl font-bold">{guide?.languages?.length || 0}</div>
                <p className="text-xs text-muted-foreground">
                  {guide?.languages?.map(l => l.code).join(", ") || "Aucune"}
                </p>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Statut</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loadingGuide ? (
              <Skeleton className="h-8 w-24" />
            ) : (
              <>
                <div className="text-2xl font-bold text-emerald-600">{guide?.status}</div>
                <p className="text-xs text-muted-foreground">Prêt pour les visites</p>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-6">
        <Card className="lg:col-span-3 flex flex-col">
          <CardHeader>
            <CardTitle>Vos prochaines visites</CardTitle>
            <CardDescription>Faites défiler pour voir vos visites à venir.</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 px-14 pb-6">
            <Carousel className="w-full">
              {loadingVisits ? (
              <div className="flex justify-center items-center h-30 text-center text-muted-foreground">
                <Skeleton className="w-full h-full"/>
              </div>
              ) : errorVisits ? (
                <div className="flex justify-center items-center h-30 text-center text-muted-foreground">{t("guide.errorVisits")}</div>
              ) : visits.length === 0 ? (
                <div className="flex justify-center items-center h-30 text-center text-muted-foreground">{t("guide.noVisits")}</div>
              ) : (
                <>
                  <CarouselContent>
                    {visits.map((visit) => (
                      <CarouselItem key={visit.id}>
                        <NextVisitCard visit={visit} />
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <CarouselPrevious />
                  <CarouselNext />
                </>
              )}
            </Carousel>
          </CardContent>
        </Card>
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Périodes bloquées</CardTitle>
            <CardDescription>
              <p className="text-sm text-muted-foreground">
                Vous avez <span className="font-semibold text-foreground">{guide?.blockedPeriods?.length}</span> absence(s) enregistrée(s).
              </p>
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loadingGuide ? (
              <div className="space-y-4">
                <Skeleton className="h-62.5 w-full rounded-xl" />
              </div>
            ) : guide?.blockedPeriods?.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-62.5 rounded-lg border border-dashed bg-muted/20">
                <IconCalendar className="h-10 w-10 text-muted-foreground mb-4 opacity-50" />
                <p className="text-sm text-muted-foreground">Aucune absence prévue.</p>
              </div>
            ) : (
              <div className="flex flex-col md:flex-row gap-2">
                <div className="flex-1 flex flex-col min-w-0">
                  <ScrollArea className="h-62.5 pr-4">
                    <div className="flex flex-col gap-3">
                      {guide?.blockedPeriods.map((event) => (
                        <div
                          key={event.id}
                          className={cn(
                            "relative rounded-lg border bg-card p-3 pl-6 transition-colors hover:bg-muted/50",
                            "after:absolute after:inset-y-3 after:left-2 after:w-1 after:rounded-full after:bg-primary"
                          )}
                        >
                          <div className="font-medium truncate">
                            {event.label[currentLanguage]}
                          </div>
                          <div className="text-muted-foreground text-xs mt-1">
                            {`${format(new Date(event.start), "dd MMM", { locale: fr })} - ${format(new Date(event.end), "dd MMM yyyy", { locale: fr })}`}
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </div>
                <div className="hidden sm:flex shrink-0 items-start justify-center">
                  <div className="border bg-card p-4">
                    <BlockedPeriodFormGuide />
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
