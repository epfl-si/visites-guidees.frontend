import type { Guide } from "@/types/guide";
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
import { Badge } from "@/components/ui/badge";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { GUIDE_STATUS } from "@/constants/status";
import { AddGuideDialog } from "@/components/guide/addGuideDialog";
import { Skeleton } from "@/components/ui/skeleton";

export const GuidesTable = ({ guides, loading, error }: { guides: Guide[], loading: boolean, error: boolean }) => {
  const { t } = useTranslation();

  return (
    <Card className="">
      <CardHeader className="flex items-center justify-between">
        <CardTitle>
          {t("guide.label")}
        </CardTitle>
        <AddGuideDialog />
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table className="">
            <TableHeader>
              <TableRow>
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
                    <TableCell><Skeleton className="h-6 w-27.5"/></TableCell>
                    <TableCell><Skeleton className="h-6 w-27.5"/></TableCell>
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
              ) : guides.map((guide) => {
                const statusConfig = GUIDE_STATUS[guide.status];
                if (!statusConfig) return null;
                const StatusIcon = statusConfig.icon;
                return (
                  <TableRow key={guide.id}>
                    <TableCell>{guide.user.firstName} {guide.user.lastName}</TableCell>
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
                )
              })}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};
