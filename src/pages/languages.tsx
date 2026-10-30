import { useTranslation } from "react-i18next"
import { useEffect, useState } from "react";
import type { ListLanguage } from "@/types/language";
import { getLanguages, removeLanguage } from "@/services/language";
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import TableLanguages from "@/components/language/table";

export default function Languages() {
  const { t } = useTranslation();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);
  const [languages, setLanguages] = useState<ListLanguage[]>([]);
  const [actionId, setActionId] = useState<number | null>(null);

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

  const triggerDeleteLanguage = async (id: number) => {}

  const triggerEditLanguage = (id: number) => {}

  const editLanguage = (id: number) => {}

  const restoreLanguage = (id: number) => {}

  return (
    <div className="flex-1 p-8 overflow-auto w-full mr-10">
      <div className="flex items-center gap-3 h-10 mb-8">
        <h1 className="text-4xl font-semibold">{t("language.title")}</h1>
      </div>
      <div className="flex flex-col gap-10">
        <TableLanguages
          error={error}
          loading={loading}
          languages={languages}
          delete={triggerDeleteLanguage}
          edit={triggerEditLanguage}
        />
        <TableLanguages
          error={error}
          loading={loading}
          languages={languages}
          restore={restoreLanguage}
        />
        <Dialog>
          <DialogContent>
            <DialogHeader>
              {t("actions.deleteConfirm")}
            </DialogHeader>
            <DialogFooter>
              <DialogClose render={<Button variant="outline">{t("actions.cancel")}</Button>} />
              <DialogClose render={
                <Button onClick={() => actionId && deleteLanguage(actionId)}
              >{t("actions.delete")}</Button>} />
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
