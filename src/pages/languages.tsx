import { useTranslation } from "react-i18next"
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useEffect, useState } from "react";
import type { ListLanguage } from "@/types/language";
import { getLanguages, removeLanguage } from "@/services/language";
import { Skeleton } from "@/components/ui/skeleton";
import { MoreVertical, Pen, Redo2, Trash2 } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function Languages() {
  const { t } = useTranslation();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);
  const [languages, setLanguages] = useState<ListLanguage[]>([]);

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

  const deleteLanguage = async (id: number) => {
    const deletedLang = await removeLanguage(id);
    if (!deletedLang.success) {
      toast.error("actions.language.errorDelete")
      return;
    }

    setLanguages(languages.map((lang) => {
      if (lang.id === id) {
        return deletedLang.data;
      }
      return lang;
    }));
    toast.success(t("actions.language.successDelete"));
  }

  return (
    <div className="flex-1 p-8 overflow-auto w-full mr-10">
      <div className="flex items-center gap-3 h-10 mb-8">
        <h1 className="text-4xl font-semibold">{t("language.title")}</h1>
      </div>
      <div className="flex flex-col gap-10">
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
            ) : languages
              .filter((lang) => !lang.deletedAt)
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
                    <Dialog>
                      <DropdownMenu>
                        <DropdownMenuTrigger>
                          <Button variant="ghost" size="icon" className="h-8 w-8 p-0 hover:text-red-700">
                            <MoreVertical className="w-6 h-6" />
                            <span className="sr-only">Open menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Pen className="w-4 h-4 mr-2" />
                            {t("actions.edit")}
                          </DropdownMenuItem>
                          <DialogTrigger render={
                            <DropdownMenuItem className="text-red-600 focus:text-red-600 cursor-pointer">
                              <Trash2 className="w-4 h-4 mr-2" />
                              {t("actions.delete")}
                            </DropdownMenuItem>
                          }>
                          </DialogTrigger>
                        </DropdownMenuContent>
                      </DropdownMenu>
                      <DialogContent>
                        <DialogHeader>
                          {t("actions.deleteConfirm")}
                        </DialogHeader>
                        <DialogFooter>
                          <DialogClose render={<Button variant="outline">{t("actions.cancel")}</Button>} />
                          <DialogClose render={<Button onClick={() => deleteLanguage(lang.id)}>{t("actions.delete")}</Button>} />
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
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
            ) : languages
              .filter((lang) => lang.deletedAt)
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
                        <DropdownMenuItem>
                          <Redo2 className="w-4 h-4 mr-2" />
                          {t("actions.restore")}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
