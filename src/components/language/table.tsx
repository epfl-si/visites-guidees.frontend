import type { ListLanguage } from "@/types/language";
import { Table, TableCaption, TableHead, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { useTranslation } from "react-i18next";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Pen, Trash2, MoreVertical, Undo2 } from "lucide-react";

export default function TableLanguages({
  loading,
  error,
  languages,
  edit,
  delete: onDelete,
  restore,
}: {
  loading: boolean,
  error: boolean,
  languages: ListLanguage[],
  edit?: (id: number) => void,
  delete?: (id: number) => void,
  restore?: (id: number) => void,
}) {
  const { t } = useTranslation()

  return (
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
        ) : (
          languages
          .filter((lang) => (restore ? !!lang.deletedAt : !lang.deletedAt))
          .map((lang) => (
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
              <TableCell className="text-center pr-22">{lang._count.reservations}</TableCell>
              <TableCell className="text-center pr-18">{lang._count.places}</TableCell>
              <TableCell className="text-center pr-18">{lang._count.guides}</TableCell>
              <TableCell className="pl-5" onClick={(e) => e.stopPropagation()}>
                  <DropdownMenu>
                    <DropdownMenuTrigger>
                      <Button variant="ghost" size="icon" className="h-8 w-8 p-0 hover:text-red-700">
                        <MoreVertical className="w-6 h-6" />
                        <span className="sr-only">Open menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {restore ? (
                        <DropdownMenuItem onClick={() => restore(lang.id)}>
                          <Undo2 className="w-4 h-4 mr-2" />
                          {t("actions.restore")}
                        </DropdownMenuItem>
                      ) : (
                        <>
                          <DropdownMenuItem onClick={() => edit && edit(lang.id)}>
                            <Pen className="w-4 h-4 mr-2" />
                            {t("actions.edit")}
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => onDelete && onDelete(lang.id)} className="text-red-600 focus:text-red-600 cursor-pointer">
                            <Trash2 className="w-4 h-4 mr-2" />
                            {t("actions.delete")}
                          </DropdownMenuItem>
                        </>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
              </TableCell>
            </TableRow>
          )))}
      </TableBody>
    </Table>
  );
}
