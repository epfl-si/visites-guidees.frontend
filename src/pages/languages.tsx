import { useTranslation } from "react-i18next"
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useEffect, useState } from "react";
import type { Language } from "@/types/language";
import { getLanguages } from "@/services/language";
import { Skeleton } from "@/components/ui/skeleton";

export default function Languages() {
  const { t } = useTranslation();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);
  const [languages, setLanguages] = useState<Language[]>([]);

  useEffect(() => {
    const fetchLanguages = async () => {
      getLanguages()
        .then((res) => {
          if (res.success) {
            setLanguages(res.data);
          }
        })
        .catch(() => setError(true))
        .finally(() => setLoading(false));
    }

    fetchLanguages();
  }, [t]);

  

  return (
  <div className="flex-1 p-8 overflow-auto w-full mr-10">
    <div className="flex items-center gap-3 h-10 mb-8">
      <h1 className="text-4xl font-semibold">{t("language.title")}</h1>
    </div>
    <Table className="border border-border bg-background">
      <TableCaption className="sr-only">{t("reservation.tableCaption")}</TableCaption>
      <TableHeader>
        <TableRow className="bg-muted/50 sticky">
          <TableHead className="w-50">{t("table.lang")}</TableHead>
          <TableHead className="w-60">{t("table.code")}</TableHead>
          <TableHead className="w-40">{t("table.reservationsNbr")}</TableHead>
          <TableHead className="w-20">{t("table.placesNbr")}</TableHead>
          <TableHead className="w-20">{t("table.guidesNbr")}</TableHead>
          <TableHead className="w-2">{t("table.action")}</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {loading ? (
          Array.from({ length: 5 }).map((_, index) => (
            <TableRow key={index}>
              <TableCell><Skeleton className="h-5 w-30" /></TableCell>
              <TableCell><Skeleton className="h-5 w-10" /></TableCell>
              <TableCell><Skeleton className="h-5 w-41" /></TableCell>
              <TableCell><Skeleton className="h-5 w-31" /></TableCell>
              <TableCell><Skeleton className="h-5 w-31" /></TableCell>
              <TableCell className="flex justify-end mr-4"><Skeleton className="h-5 w-6"/></TableCell>
            </TableRow>
          ))
        ) : error ? (
          <TableRow>
            <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
              {t("language.fetchError")}
            </TableCell>
          </TableRow>
        ) : languages.length === 0 ? (
          <TableRow>
            <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
              {t("language.empty")}
            </TableCell>
          </TableRow>
        ) : languages.map((lang) => (
          <TableRow
            key={lang.id}
            onClick={() => "#"}
            className="hover:cursor-pointer"
          >
            <TableCell className="font-medium">
              <div
                aria-label={t("reservation.openDetails", { name: lang.name })}
                className="underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
              >
                {lang.name ?? "-"}
              </div>
            </TableCell>
            <TableCell>{lang.code}</TableCell>
            <TableCell></TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </div>
  )
}
