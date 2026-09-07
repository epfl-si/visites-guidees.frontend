import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { useTranslation } from 'react-i18next';
import type { Place } from "@/types/place";
import { Skeleton } from "@/components/ui/skeleton";

export const PlacesTable = ({ places, loading }: { places: Place[], loading: boolean }) => {
  const { t, i18n } = useTranslation();

  if (!loading && (!places || places.length === 0)) {
    return <p className="text-center text-muted-foreground p-4">{t("place.notFound")}</p>;
  }

  const currentLang = (i18n.resolvedLanguage || 'en') as 'en' | 'fr';

  return (
    <Card className="">
      <CardHeader>
        <CardTitle>
          {t("place.title")}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table className="">
            <TableHeader>
              <TableRow>
                <TableHead>{t("table.title")}</TableHead>
                <TableHead>{t("table.capacity")}</TableHead>
                <TableHead>{t("table.price")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                Array.from({ length: 5 }).map((_, index) => (
                  <TableRow key={index}>
                    <TableCell><Skeleton className="h-4 w-45" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-30" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-30" /></TableCell>
                  </TableRow>
                ))
              ) : places.map((place) => (
                <TableRow key={place.id}>
                  <TableCell>{place.title?.[currentLang] ?? "-"}</TableCell>
                  <TableCell>{place.capacity}</TableCell>
                  <TableCell>{place.price}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};
