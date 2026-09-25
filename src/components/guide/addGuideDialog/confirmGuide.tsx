import {
  ArrowLeft,
  CalendarDays,
  CircleCheck,
  Languages,
  MapPin,
  Pencil,
  UserRound,
} from "lucide-react"
import { useState } from "react"
import { useTranslation } from "react-i18next"
import { toast } from "sonner"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DialogFooter } from "@/components/ui/dialog"
import { Spinner } from "@/components/ui/spinner"
import { addGuide } from "@/services/guide"
import type { CreateGuide } from "@/types/guide"
import type { Language } from "@/types/language"
import type { Place } from "@/types/place"
import type { ResponseUserAPI } from "@/types/user"

export const ConfirmGuide = ({
  setStep,
  selectedGuide,
  selectedInformation,
  languages,
  places,
  onAdded,
}: {
  setStep: (step: number) => void
  selectedGuide: ResponseUserAPI | null
  selectedInformation: CreateGuide
  languages: Language[]
  places: Place[]
  onAdded: () => void
}) => {
  const { t, i18n } = useTranslation()
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
  const currentLanguage = (i18n.resolvedLanguage || "en") as "en" | "fr"

  const selectedLanguages = languages.filter((language) =>
    selectedInformation.languageIds.includes(language.id)
  )
  const selectedPlaces = places.filter((place) =>
    selectedInformation.placeIds.includes(place.id)
  )
  const startDate = new Date(selectedInformation.startDate)

  async function handleSubmit() {
    setIsSubmitting(true)
    try {
      const response = await addGuide(selectedInformation)
      if (!response.success) {
        if (response.code === 401) return
        throw new Error(response.error)
      }
      toast.success(t("guide.addSuccess"))
      onAdded()
    } catch {
      toast.error(t("guide.addError"))
    } finally {
      setIsSubmitting(false)
    }
  }

  const rows = [
    {
      icon: UserRound,
      label: t("guide.dialog.confirm.guide"),
      step: 1,
      content: selectedGuide && (
        <span>
          {selectedGuide.firstName} {selectedGuide.lastName}{" "}
          <span className="text-muted-foreground">{selectedGuide.sciper}</span>
        </span>
      ),
    },
    {
      icon: Languages,
      label: t("guide.dialog.confirm.languages"),
      step: 2,
      content: (
        <div className="flex flex-wrap gap-1">
          {selectedLanguages.map((language) => (
            <Badge key={language.id} variant="secondary">
              {language.name}
            </Badge>
          ))}
        </div>
      ),
    },
    {
      icon: MapPin,
      label: t("guide.dialog.confirm.places"),
      step: 3,
      content: (
        <div className="flex flex-wrap gap-1">
          {selectedPlaces.map((place) => (
            <Badge key={place.id} variant="secondary">
              {place.title[currentLanguage]}
            </Badge>
          ))}
        </div>
      ),
    },
    {
      icon: CalendarDays,
      label: t("guide.dialog.confirm.startDate"),
      step: 4,
      content: startDate.toLocaleDateString(i18n.resolvedLanguage, {
        dateStyle: "full",
      }),
    },
  ]

  return (
    <div className="flex flex-col gap-3">
      <div className="divide-y rounded-lg border">
        {rows.map((row) => (
          <div key={row.step} className="flex items-start gap-3 p-3 text-sm">
            <row.icon className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
            <div className="flex min-w-0 flex-1 flex-col gap-1.5">
              <span className="text-xs text-muted-foreground">{row.label}</span>
              {row.content}
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setStep(row.step)}
              disabled={isSubmitting}
            >
              <Pencil data-icon="inline-start" />
              {t("guide.dialog.confirm.edit")}
            </Button>
          </div>
        ))}
      </div>

      <DialogFooter className="sm:justify-between">
        <Button
          variant="outline"
          onClick={() => setStep(4)}
          disabled={isSubmitting}
        >
          <ArrowLeft data-icon="inline-start" />
          {t("actions.previous")}
        </Button>
        <Button onClick={handleSubmit} disabled={isSubmitting}>
          {isSubmitting ? (
            <Spinner data-icon="inline-start" />
          ) : (
            <CircleCheck data-icon="inline-start" />
          )}
          {t("guide.dialog.confirm.submit")}
        </Button>
      </DialogFooter>
    </div>
  )
}
