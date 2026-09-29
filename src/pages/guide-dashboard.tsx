import { fetchConnectedUser } from "@/services/auth"
import { getGuide } from "@/services/guide";
import type { Guide } from "@/types/guide";
import { useEffect, useState } from "react"
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";
import { toast } from "sonner"
import { Calendar, Clock, MapPin, Activity } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function GuideDashboard() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [loading, setLoading] = useState<boolean>(true);
  const [guide, setGuide] = useState<Guide | null>(null);


  useEffect(() => {
    const fetchGuide = async () => {
      try {
        const user = await fetchConnectedUser();
        if (user.success) {
          const guide = await getGuide(Number(user.data.sciper));
          if (guide.success) {
            setGuide(guide.data);
            return;
          }
        }
        navigate("/");
      } catch {
        toast.error(t("guide.dashboard.fetchError"))
        navigate("/");
      } finally {
        setLoading(false);
      }
    }
    fetchGuide();
  }, [t, guide, navigate])



  return (
      <div className="flex-1 flex-col overflow-y-auto bg-muted/10 p-8">

        <div className="mb-8 flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">
          {t("guide.dashboard.welcome")}, {guide?.user.firstName} {guide?.user.lastName}
          </h1>
          <p className="text-muted-foreground">
            Voici un résumé de votre activité et de vos prochaines visites.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Visites à venir
              </CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">3</div>
              <p className="text-xs text-muted-foreground">
                Cette semaine
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Heures guidées
              </CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12.5h</div>
              <p className="text-xs text-muted-foreground">
                Ce mois-ci
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Langues actives
              </CardTitle>
              <MapPin className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{guide?.languages?.length || 0}</div>
              <p className="text-xs text-muted-foreground">
                {guide?.languages?.map(l => l.code).join(", ") || "Aucune"}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Statut
              </CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
            <div className="text-2xl font-bold text-emerald-600">{guide?.status}</div>
              <p className="text-xs text-muted-foreground">
                Prêt pour les visites
              </p>
            </CardContent>
          </Card>

        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-7">

          <Card className="lg:col-span-4">
            <CardHeader>
              <CardTitle>Votre prochaine visite</CardTitle>
              <CardDescription>
                Détails de la visite prévue aujourd'hui.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center h-32 rounded-lg border border-dashed">
                <p className="text-sm text-muted-foreground">Aucune visite prévue aujourd'hui.</p>
              </div>
            </CardContent>
          </Card>

          <Card className="lg:col-span-3">
            <CardHeader>
              <CardTitle>Périodes bloquées</CardTitle>
              <CardDescription>
                Vos prochaines indisponibilités.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {guide?.blockedPeriods?.length === 0 ? (
                   <p className="text-sm text-muted-foreground">Aucune absence prévue.</p>
                ) : (
                  <p className="text-sm">Vous avez des absences enregistrées.</p>
                )}
              </div>
            </CardContent>
          </Card>

        </div>
      </div>
    )
}
