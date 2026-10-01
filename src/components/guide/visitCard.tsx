import { useTranslation } from "react-i18next";
import { Link } from "react-router";
import {
  Calendar,
  Clock,
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
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import type { Reservation } from "@/types/reservation";
import type { Languages } from "@/types/language";

interface NextVisitCardProps {
  visit?: Reservation | null;
  loading: boolean;
  className?: string;
}

export function NextVisitCard({ visit, loading, className }: NextVisitCardProps) {
  const { i18n } = useTranslation();
  const currentLang = i18n.resolvedLanguage as Languages;

  return (
    <Card className={cn("flex flex-col", className)}>
      <CardHeader>
        <CardTitle>Votre prochaine visite</CardTitle>
        <CardDescription>
          Détails de la visite à venir la plus proche.
        </CardDescription>
      </CardHeader>

      <CardContent className="flex-1">
        {loading ? (
          <div className="space-y-4">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        ) : visit ? (
          <div className="flex flex-col h-full justify-between gap-6">

            <div className="border-b pb-4">
              <h3 className="font-semibold text-lg text-foreground">
                {visit.place.title[currentLang] || "Visite guidée"}
              </h3>
              <div className="flex items-center text-sm text-muted-foreground mt-2 gap-4">
                <div className="flex items-center gap-1.5">
                  <Calendar className="h-4 w-4" />
                  <span>
                    {new Date(visit.date).toLocaleDateString("fr-CH", {
                      weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
                    })}
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="h-4 w-4" />
                  <span>
                    {new Date(visit.date).toLocaleTimeString("fr-CH", {
                      hour: '2-digit', minute:'2-digit'
                    })}
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                <span>{visit.participantNumber} personnes</span>
              </div>
              <div className="flex items-center gap-2">
                <Globe className="h-4 w-4 text-muted-foreground" />
                <span>{visit.language?.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <span>{visit.firstName} {visit.lastName}</span>
              </div>
              {visit.company && (
                <div className="flex items-center gap-2">
                  <Building className="h-4 w-4 text-muted-foreground" />
                  <span className="truncate">{visit.company}</span>
                </div>
              )}
            </div>

            <div className="mt-auto pt-4">
              <Button variant="secondary" className="w-full group">
                <Link to={`/admin/reservation/${visit.id}`}>
                  Voir les détails complets
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
            </div>

          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-40 rounded-lg border border-dashed bg-muted/30">
            <Calendar className="h-10 w-10 text-muted-foreground mb-3 opacity-50" />
            <p className="text-sm font-medium text-foreground">Aucune visite prévue</p>
            <p className="text-xs text-muted-foreground mt-1">Vous n'avez pas de visite assignée pour le moment.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
