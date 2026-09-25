import { ArrowLeft, ArrowRight } from "lucide-react"
import { useEffect, useState } from "react"
import type { Dispatch, SetStateAction } from "react"
import { useTranslation } from "react-i18next"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Skeleton } from "@/components/ui/skeleton"
import { getLanguages as getAvailableLanguages } from "@/services/language"
import type { CreateGuide } from "@/types/guide"
import type { Language } from "@/types/language"

export const SelectLanguage = ({
  setStep,
  selectedInformation,
  setSelectedInformation,
  languages,
  setLanguages,
}: {
  setStep: (step: number) => void
  selectedInformation: CreateGuide
  setSelectedInformation: Dispatch<SetStateAction<CreateGuide>>
  languages: Language[]
  setLanguages: Dispatch<SetStateAction<Language[]>>
}) => {
  const { t } = useTranslation()
  const selectedLanguages = selectedInformation.languageIds
  const [isWaiting, setIsWaiting] = useState<boolean>(true)

  useEffect(() => {
    async function getLanguages() {
      try {
        const languagesResponse = await getAvailableLanguages()
        if (!languagesResponse.success) {
          if (languagesResponse.code === 401) {
            setLanguages([])
            return
          }
          throw new Error(languagesResponse.error)
        }
        setLanguages(languagesResponse.data)
      } catch {
        toast.error(t("errors.dataloading.defaultMessage"))
        setLanguages([])
      } finally {
        setIsWaiting(false)
      }
    }
    getLanguages()
  }, [setLanguages, t])

  function toggleLanguage(id: number, checked: boolean) {
    setSelectedInformation((prev) => ({
      ...prev,
      languageIds: checked
        ? [...prev.languageIds, id]
        : prev.languageIds.filter((languageId) => languageId !== id),
    }))
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="grid grid-cols-2 gap-3">
        {isWaiting ? (
          Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))
        ) : languages.length === 0 ? (
          <p className="col-span-2 py-6 text-center text-sm text-muted-foreground">
            {t("guide.dialog.language.empty")}
          </p>
        ) : (
          languages.map((language) => (
            <Label
              key={language.id}
              className="cursor-pointer rounded-lg border p-3 transition-colors hover:bg-muted/50 has-data-checked:border-primary has-data-checked:bg-primary/5"
            >
              <Checkbox
                checked={selectedLanguages.includes(language.id)}
                onCheckedChange={(checked) =>
                  toggleLanguage(language.id, checked)
                }
              />
              {language.name}
              <span className="ml-auto rounded bg-muted px-1.5 py-0.5 text-xs text-muted-foreground uppercase">
                {language.code}
              </span>
            </Label>
          ))
        )}
      </div>

      <p className="text-xs text-muted-foreground">
        {selectedLanguages.length === 0
          ? t("guide.dialog.language.none")
          : t("guide.dialog.language.selected", {
            count: selectedLanguages.length,
          })}
      </p>

      <DialogFooter className="sm:justify-between">
        <Button variant="outline" onClick={() => setStep(1)}>
          <ArrowLeft data-icon="inline-start" />
          {t("actions.previous")}
        </Button>
        <Button
          disabled={selectedLanguages.length === 0}
          onClick={() => setStep(3)}
        >
          {t("actions.next")}
          <ArrowRight data-icon="inline-end" />
        </Button>
      </DialogFooter>
    </div>
  )
}
