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

export const GuidesTable = ({ guides }: { guides: Guide[] }) => {
  const { t } = useTranslation();

  if (!guides || guides.length === 0) {
    return <p className="text-center text-muted-foreground p-4">Aucun guide trouvé.</p>;
  }

  return (
    <Card className="">
      <CardHeader>
        <CardTitle>
          Guide
        </CardTitle>
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
              {guides.map((guide) => {
                const statusConfig = GUIDE_STATUS[guide.status];
                if (!statusConfig) return null;
                const StatusIcon = statusConfig.icon;
                return (
                  <TableRow key={guide.id}>
                    <TableCell>{guide.user.firstName} {guide.user.lastName}</TableCell>
                    <TableCell>{guide.user.email}</TableCell>
                    <TableCell>{guide.phone}</TableCell>
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
