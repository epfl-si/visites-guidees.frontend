import { ArrowLeft, ArrowRight } from "lucide-react"
import type { Dispatch, SetStateAction } from "react"
import { enUS, fr } from "react-day-picker/locale"
import { useTranslation } from "react-i18next"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { DialogFooter } from "@/components/ui/dialog"
import type { CreateGuide } from "@/types/guide"

export const SelectStartDate = ({
  setStep,
  selectedInformation,
  setSelectedInformation,
}: {
  setStep: (step: number) => void
  selectedInformation: CreateGuide
  setSelectedInformation: Dispatch<SetStateAction<CreateGuide>>
}) => {
  const { t, i18n } = useTranslation()

  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const lastMonth = new Date(today.getFullYear() + 2, 11)

  const selectedDate = selectedInformation.startDate
    ? new Date(selectedInformation.startDate)
    : undefined

  function selectDate(date: Date | undefined) {
    const startDate = date
      ? new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate(),
        12
      ).toISOString()
      : ""
    setSelectedInformation((prev) => ({ ...prev, startDate }))
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex justify-center">
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={selectDate}
          defaultMonth={selectedDate ?? today}
          disabled={{ before: today }}
          startMonth={today}
          endMonth={lastMonth}
          captionLayout="dropdown"
          locale={i18n.resolvedLanguage === "fr" ? fr : enUS}
          className="rounded-lg border"
        />
      </div>

      <p className="text-center text-xs text-muted-foreground">
        {selectedDate
          ? t("guide.dialog.calendar.selected", {
            date: selectedDate.toLocaleDateString(i18n.resolvedLanguage, {
              dateStyle: "full",
            }),
          })
          : t("guide.dialog.calendar.none")}
      </p>

      <DialogFooter className="sm:justify-between">
        <Button variant="outline" onClick={() => setStep(3)}>
          <ArrowLeft data-icon="inline-start" />
          {t("actions.previous")}
        </Button>
        <Button disabled={!selectedDate} onClick={() => setStep(5)}>
          {t("actions.next")}
          <ArrowRight data-icon="inline-end" />
        </Button>
      </DialogFooter>
    </div>
  )
}
