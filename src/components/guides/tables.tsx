import type { guideInfo } from "@/types/guide"
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useTranslation } from "react-i18next"
import { Loader2 } from "lucide-react"

export const GuideInfoTable = ({
  guideInfo,
  isLoading,
}: {
  guideInfo: guideInfo[]
  isLoading?: boolean
}) => {
  const { t } = useTranslation()

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("guide.title")}</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center p-8">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : guideInfo.length === 0 ? (
          <p className="p-4 text-center text-muted-foreground">
            {t("errors.notFound")}
          </p>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t("guide.firstName")}</TableHead>
                  <TableHead>{t("guide.lastName")}</TableHead>
                  <TableHead>{t("guide.email")}</TableHead>
                  <TableHead>{t("guide.phone")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {guideInfo.map((guide) => (
                  <TableRow key={guide.id}>
                    <TableCell>{guide.firstName}</TableCell>
                    <TableCell>{guide.lastName}</TableCell>
                    <TableCell>{guide.email}</TableCell>
                    <TableCell>{guide.phone}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
