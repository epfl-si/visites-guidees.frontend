import type { Guide } from "@/types/guide"
import { useEffect, useState } from "react";
import { Empty, EmptyHeader, EmptyDescription, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { User, Search } from "lucide-react";
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
import { Skeleton } from "@/components/ui/skeleton";
import { useNavigate } from "react-router";
import { Badge } from "@/components/ui/badge";
import { AddGuideDialog } from "@/components/guide/addGuideDialog";

export default function Guides() {
  const [guides, setGuides] = useState<Guide[]>([]);
  const [inputSearch, setInputSearch] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [error, setError] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  const navigate = useNavigate();

  const { t } = useTranslation();

  useEffect(() => {
    const fetchGuides = async () => {
      getGuides().then((res) => {
        if (res.success) {
          setGuides(res.data);
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

  const searchGuides = (guide: Guide, searchQuery: string) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase().trim();
    const statusConfig = GUIDE_STATUS[guide.status as keyof typeof GUIDE_STATUS];

    const haystack = [
      guide.user?.firstName,
      guide.user?.lastName,
      guide.user?.email,
      ...(guide.phone || []),
      ...(guide.languages?.map((l) => l.name) || []),
      statusConfig ? t(statusConfig.labelKey) : guide.status,
    ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

    return haystack.includes(query);
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

  return (
    <>
      <div className="flex-1 p-8 overflow-auto w-full mr-10">
        <div className="flex items-center gap-3 h-10 mb-8">
          <h1 className="text-4xl font-semibold">{t("guide.title")}</h1>
          <AddGuideDialog />
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
              <Select
                value={statusFilter}
                onValueChange={(val) => setStatusFilter(val ?? "ALL")}
              >
                <SelectTrigger className="w-50 h-full shrink-0 bg-background">
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
          </div>
          <Table className="border border-border bg-background">
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead>{t("table.name")}</TableHead>
                <TableHead>{t("table.email")}</TableHead>
                <TableHead>{t("table.phoneNumber")}</TableHead>
                <TableHead>{t("table.language")}</TableHead>
                <TableHead>{t("table.status")}</TableHead>
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
              ) : guides.length === 0 ? (
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
                filteredGuides.map((guide) => {
                  const statusConfig = GUIDE_STATUS[guide.status];
                  if (!statusConfig) return null;
                  const StatusIcon = statusConfig.icon;
                  return (
                    <TableRow
                      key={guide.id}
                      onClick={() => navigate("#")}
                      className="hover:cursor-pointer"
                    >
                      <TableCell className="font-medium">{guide.user.firstName ?? "-"} {guide.user.lastName ?? "-"}</TableCell>
                      <TableCell>{guide.user.email}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className="whitespace-nowrap">{guide.phone[0]}</span>

                          {guide.phone.length > 1 && (
                            <HoverCard>
                              <HoverCardTrigger delay={10} closeDelay={100} render={
                                <Badge variant="secondary" className="cursor-pointer">
                                  +{guide.phone.length - 1}
                                </Badge>
                              } />
                              <HoverCardContent className="w-auto p-3">
                                <div className="flex flex-col gap-1.5">
                                  <span className="text-xs font-semibold text-muted-foreground uppercase">
                                    {t("admin.guides.allPhones")}
                                  </span>
                                  {guide.phone.map((p, i) => (
                                    <span key={i} className="text-sm font-medium">{p}</span>
                                  ))}
                                </div>
                              </HoverCardContent>
                            </HoverCard>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="flex gap-1">{guide.languages.map((lang) => (
                        <HoverCard key={lang.id}>
                          <HoverCardTrigger delay={10} closeDelay={100} render={<Badge variant="outline" className="hover:bg-red-300 hover:text-red-500 ">{lang.code}</Badge>} />
                          <HoverCardContent className="w-auto">
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
