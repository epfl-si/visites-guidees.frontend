import { useTranslation } from "react-i18next"
import { useEffect, useState } from "react";
import type { ListLanguage } from "@/types/language";
import { editLanguage, getLanguages, removeLanguage, restoreLanguage } from "@/services/language";
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import TableLanguages from "@/components/language/table";

export default function Languages() {
  const { t } = useTranslation();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);
  const [languages, setLanguages] = useState<ListLanguage[]>([]);
  const [actionId, setActionId] = useState<number | null>(null);
  const [action, setAction] = useState<'edit' | 'delete' | null>(null);
  const [editLang, setEditLang] = useState<ListLanguage | null>(null);

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

  const triggerDeleteLanguage = async (id: number) => {
    setActionId(id);
    setAction('delete');
  }

  const triggerEditLanguage = (id: number) => {
    setActionId(id);
    setAction('edit');
    const langToEdit = languages.find((lang) => lang.id === id);
    setEditLang(langToEdit ? { ...langToEdit } : null);
  }

  const modifyLanguage = async (id: number) => {
    if (!editLang) return;

    const deletedLang = await editLanguage(id, editLang);
    if (!deletedLang.success) {
      toast.error("actions.language.errorEdit")
      return;
    }

    setLanguages(languages.map((lang) => {
      if (lang.id === id) {
        return deletedLang.data;
      }
      return lang;
    }));
    toast.success(t("actions.language.successEdit"));
  }

  const restoreLang = async (id: number) => {
    const restoreLang = await restoreLanguage(id);
    if (!restoreLang.success) {
      toast.error("actions.language.errorRestore")
      return;
    }

    setLanguages(languages.map((lang) => {
      if (lang.id === id) {
        return restoreLang.data;
      }
      return lang;
    }));
    toast.success(t("actions.language.successRestore"));
  }

  const handleConfirmAction = () => {
    if (!actionId) return;
    if (action === null) return;

    if (action === 'delete') {
      deleteLanguage(actionId);
    } else {
      modifyLanguage(actionId);
    }

    setActionId(null);
    setAction(null);
  }

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
        {languages.some((lang) => lang.deletedAt) && (
          <>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-semibold">{t("language.deletedTitle")}</h1>
            </div>
            <TableLanguages
              error={error}
              loading={loading}
              languages={languages}
              restore={restoreLang}
            />
          </>
        )}
        <Dialog open={action !== null} onOpenChange={(open) => {
          if (!open) {
            setAction(null);
            setEditLang(null);
          }
        }}>
          <DialogContent>
            <DialogHeader>
              {action === 'delete' && t("actions.language.deleteConfirm")}
              {action === 'edit' && t("actions.language.editConfirm")}
            </DialogHeader>
            {action === 'edit' && editLang && (
              <div className="flex flex-col gap-4 py-4">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="name">{t("table.lang")}</Label>
                  <Input
                    id="name"
                    value={editLang.name ?? ""}
                    onChange={(e) => setEditLang({ ...editLang, name: e.target.value })}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="code">{t("table.code")}</Label>
                  <Input
                    id="code"
                    value={editLang.code ?? ""}
                    onChange={(e) => setEditLang({ ...editLang, code: e.target.value })}
                  />
                </div>
              </div>
            )}
            <DialogFooter>
              <DialogClose render={<Button variant="outline">{t("actions.cancel")}</Button>} />
              <DialogClose render={
                <Button
                  variant={action === 'delete' ? 'destructive' : 'default'}
                  onClick={handleConfirmAction}
                >
                  {action === 'delete' && t("actions.delete")}
                  {action === 'edit' && t("actions.save")}
                </Button>
              } />
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
