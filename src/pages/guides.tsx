import type { Guide } from "@/types/guide"
import { useEffect, useState } from "react";
import { Empty, EmptyHeader, EmptyDescription, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { Calendar, Search } from "lucide-react";
import { getGuides } from "@/services/guide";
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
import { useNavigate } from "react-router";
import { Badge } from "@/components/ui/badge";

export default function Guides() {
  const [guides, setGuides] = useState<Guide[]>([]);
  const [inputSearch, setInputSearch] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");

  const navigate = useNavigate();

  const { t } = useTranslation();

  useEffect(() => {
    const fetchGuides = async () => {
      const data = await getGuides();
      console.log("data : ", data)
      if (data.success) setGuides(data.data);
    }
    fetchGuides();
  }, []);

  const searchGuides = (guide: Guide, searchQuery: string) => {
    if (!searchQuery) return true;

    const query = searchQuery.toLowerCase().trim();

    const matchInValues = Object.values(guide).some((value) => {
      if (value === null || value === undefined) return false;
      return String(value).toLowerCase().includes(query);
    });

    let matchInTranslatedStatus = false;
    const statusConfig = GUIDE_STATUS[guide.status as keyof typeof GUIDE_STATUS];

    if (statusConfig) {
      const translatedStatus = t(statusConfig.labelKey).toLowerCase();
      matchInTranslatedStatus = translatedStatus.includes(query);
    }

    return matchInValues || matchInTranslatedStatus;
  };

  const filteredGuides = guides.filter((guide) => {
    const matchSearch = searchGuides(guide, inputSearch);

    const matchStatus = statusFilter === "ALL" || guide.status === statusFilter;

    return matchSearch && matchStatus;
  });

  const getSelectedLabel = () => {
    if (statusFilter === "ALL") return t("guide.allStatus");

    const config = GUIDE_STATUS[statusFilter as keyof typeof GUIDE_STATUS];
    return config ? t(config.labelKey) : statusFilter;
  };


  if (guides.length === 0) {
    return (
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <Calendar />
          </EmptyMedia>
          <EmptyTitle>{t("guide.notFound")}</EmptyTitle>
          <EmptyDescription>
            {t("guide.notFoundDescription")}
          </EmptyDescription>
        </EmptyHeader>
      </Empty >
    )
  }

  return (
    <>
      <div className="flex-1 p-8 overflow-auto w-full mr-10">
        <div className="flex items-center gap-3 h-10 mb-8">
          <h1 className="text-4xl font-semibold">{t("guide.title")}</h1>
        </div>
        <div className="flex flex-col gap-6">
          <div className="flex gap-4">
            <div className="relative flex-1 flex items-center">
              <Search className="absolute left-3 h-4 w-4 text-muted-foreground pointer-events-none shrink-0" />
              <input
                type="search"
                value={inputSearch}
                onChange={(e) => setInputSearch(e.target.value)}
                placeholder={t("table.search", "Search a guide")}
                className="h-9 w-full border border-input bg-background pl-9 pr-3 text-sm outline-none focus:ring-1 focus:ring-ring placeholder:text-muted-foreground"
              />
            </div>

            <Select
              value={statusFilter}
              onValueChange={(val) => setStatusFilter(val ?? "ALL")}
            >
              <SelectTrigger className="w-50 h-9 shrink-0 bg-background">
                <SelectValue placeholder={t("table.filterStatus", "Filtrer par statut")}>
                  {getSelectedLabel()}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">
                  {t("guide.allStatus")}
                </SelectItem>
                {Object.entries(GUIDE_STATUS).map(([key, config]) => (
                  <SelectItem key={key} value={key}>
                    {t(config.labelKey)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

      <Table className="border border-border bg-background">
        <TableHeader>
          <TableRow className="bg-muted/50">
            <TableHead>{t("table.company")}</TableHead>
            <TableHead>{t("table.email")}</TableHead>
            <TableHead>{t("table.date")}</TableHead>
            <TableHead>{t("table.status")}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredGuides.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                {t("guide.noResults")}
              </TableCell>
            </TableRow>
          ) : (

            filteredGuides.map((guide) => {
              const statusConfig = GUIDE_STATUS[guide.status];
              if (!statusConfig) return null;
              const StatusIcon = statusConfig.icon;
              return (
                <TableRow
                  key={guide.id}
                  onClick={() => navigate(guide.id.toString())}
                  className="hover:cursor-pointer"
                >
                  <TableCell className="font-medium">{guide.user.firstName ?? "-"} {guide.user.lastName ?? "-"}</TableCell>
                  <TableCell>{guide.user.email}</TableCell>
                  <TableCell className="flex gap-1">{guide.languages.map((lang) => (
                    <HoverCard>
                      <HoverCardTrigger delay={10} closeDelay={100} render={<Badge variant="outline" className="hover:bg-red-300 hover:text-red-500 ">{lang.code}</Badge>} />
                      <HoverCardContent className="w-1xs">
                        <div className="flex justify-center">{lang.name}</div>
                      </HoverCardContent>
                    </HoverCard>
                  ))}</TableCell>
                  <TableCell>
                    <div className={`flex items-center gap-2 ${statusConfig.colorClass}`}>
                      <StatusIcon className="w-4 h-4" />
                      <span className="text-sm font-medium">
                        {t(statusConfig.labelKey)}
                      </span>
                    </div>
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
