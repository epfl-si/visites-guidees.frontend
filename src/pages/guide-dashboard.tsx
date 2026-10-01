import { fetchConnectedUser } from "@/services/auth"
import { getGuide, getVisitsByGuide } from "@/services/guide";
import type { Guide } from "@/types/guide";
import { useEffect, useState } from "react"
import { useTranslation } from "react-i18next";
import { useNavigate, Link } from "react-router";
import { NextVisitCard } from "@/components/guide/visitCard";
import { toast } from "sonner"
import {
  Calendar,
  Clock,
  MapPin,
  Activity,
  Users,
  Globe,
  User,
  Building,
  ArrowRight
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { Reservation } from "@/types/reservation";
import { Skeleton } from "@/components/ui/skeleton";
import type { Languages } from "@/types/language";

export default function GuideDashboard() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const currentLang = i18n.resolvedLanguage as Languages;

  const [loadingGuide, setLoadingGuide] = useState<boolean>(true);
  const [loadingVisits, setLoadingVisits] = useState<boolean>(true);
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
          .finally(() => {
            setLoadingVisits(false);
          });
      }
    };
    fetchVisits();
  }, [guide]);

  const nextVisit = visits.length > 0 ? visits[0] : null;

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
            <Calendar className="h-4 w-4 text-muted-foreground" />
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

      <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <NextVisitCard
          visit={nextVisit}
          loading={loadingVisits}
          className="lg:col-span-4"
        />
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Périodes bloquées</CardTitle>
            <CardDescription>Vos prochaines indisponibilités.</CardDescription>
          </CardHeader>
          <CardContent>
            {loadingGuide ? (
              <div className="space-y-3">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
            ) : guide?.blockedPeriods?.length === 0 ? (
              <div className="flex items-center justify-center h-32 rounded-lg border border-dashed">
                 <p className="text-sm text-muted-foreground">Aucune absence prévue.</p>
              </div>
            ) : (
              <div className="space-y-3">
                <p className="text-sm">Vous avez {guide?.blockedPeriods?.length} absence(s) enregistrée(s).</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
