import { useEffect, useState } from "react";
import { Empty, EmptyHeader, EmptyDescription, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { User, Search } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useTranslation } from "react-i18next";
import { GUIDE_STATUS } from "@/constants/status";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useNavigate } from "react-router";
import { Badge } from "@/components/ui/badge";
import type { PlaceInformationType } from "@/types/place";
import { getPlaces } from "@/services/place"
import type { Languages } from "@/types/language";

export default function Places() {
    const { i18n } = useTranslation();
  
    const currentLang = i18n.resolvedLanguage as Languages;
  
  const [places, setPlaces] = useState<PlaceInformationType[]>([]);
  const [inputSearch, setInputSearch] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [error, setError] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  const navigate = useNavigate();

  const { t } = useTranslation();

  useEffect(() => {
    const fetchGuides = async () => {
      getPlaces(true).then((res) => {
        if (res.success) {
          setPlaces(res.data);
        } else {
          setError(true);
        }
      }).catch(() => {
        setError(true);
      }).finally(() => {
        setLoading(false);
      })
    }
    fetchGuides();
  }, []);


  return (
    <>
      <div className="flex-1 p-8 overflow-auto w-full mr-10">
        <div className="flex items-center gap-3 h-10 mb-8">
          <h1 className="text-4xl font-semibold">{t("guide.title")}</h1>
        </div>
        <div className="flex flex-col gap-6">
          <div className="flex gap-4">
            <div className="relative flex-1 gap-3 flex items-center">
              <Search className="absolute left-3 h-4 w-4 text-muted-foreground pointer-events-none shrink-0" />
              <input
                type="search"
                value={inputSearch}
                onChange={(e) => setInputSearch(e.target.value)}
                placeholder={t("table.search", "Search a guide")}
                className="h-full w-full rounded-md border border-input bg-background pl-9 pr-3 text-sm outline-none focus:ring-1 focus:ring-ring placeholder:text-muted-foreground"
              />
            </div>
          </div>
          <Table className="border border-border bg-background">
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead>{t("table.picture")}</TableHead>
                <TableHead>{t("table.name")}</TableHead>
                <TableHead>{t("table.price")}</TableHead>
                <TableHead>{t("table.language")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                Array.from({ length: 5 }).map((_, index) => (
                  <TableRow key={index}>
                    <TableCell><Skeleton className="h-4 w-30" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-45" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-25" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-27" /></TableCell>
                  </TableRow>
                ))
              ) : error ? (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    className="h-66.25 text-center text-muted-foreground"
                  >
                    {t("admin.guides.loadError")}
                  </TableCell>
                </TableRow>
              ) : places.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    className="h-66.25 text-center text-muted-foreground"
                  >
                    <Empty>
                      <EmptyHeader>
                        <EmptyMedia variant="icon">
                          <User />
                        </EmptyMedia>
                        <EmptyTitle>{t("guide.notFound")}</EmptyTitle>
                        <EmptyDescription>
                          {t("guide.notFoundDescription")}
                        </EmptyDescription>
                      </EmptyHeader>
                    </Empty >
                  </TableCell>
                </TableRow>
              ) : (
                places.map((place) => {
                  return (
                    <TableRow
                      key={place.id}
                      onClick={() => navigate("#")}
                      className="hover:cursor-pointer"
                    >
                      <TableCell className="font-medium max-w-16"><img src={place.picture} alt={place.title[currentLang]} /></TableCell>
                      <TableCell>{place.title[currentLang]}</TableCell>
                      <TableCell className=""><span className="text-destructive font-bold">{place.price}</span> CHF</TableCell>
                      <TableCell className="">{place.languages.map((lang) => (
                        <HoverCard key={lang.id}>
                          <HoverCardTrigger delay={10} closeDelay={100} render={<Badge variant="outline" className="hover:bg-red-300 hover:text-red-500 ">{lang.code}</Badge>} />
                          <HoverCardContent className="w-auto">
                            <div className="flex justify-center">{lang.name}</div>
                          </HoverCardContent>
                        </HoverCard>
                      ))}</TableCell>
                      <TableCell>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </>
  )
}
