import { useTranslation } from "react-i18next";
import {
  Calendar,
  Clock,
  Users,
  Globe,
  User,
  Building,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { Reservation } from "@/types/reservation";
import type { Languages } from "@/types/language";


export function NextVisitCard({ visit }: { visit: Reservation }) {
  const { i18n } = useTranslation();
  const currentLang = i18n.resolvedLanguage as Languages;

  return (
    <Card className="flex flex-col lg:col-span-4">
      <CardHeader>
        <CardTitle>Visite #{visit.id}</CardTitle>
      </CardHeader>

      <CardContent className="flex-1">
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
        </div>
      </CardContent>
    </Card>
  );
}
