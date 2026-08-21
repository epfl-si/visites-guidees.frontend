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

export const PlacesTable = ({ places }: { places: Place[] }) => {
  const { t, i18n } = useTranslation();

  if (!places || places.length === 0) {
    return <p className="text-center text-muted-foreground p-4">Aucune place trouvée.</p>;
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
              {places.map((place) => (
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
