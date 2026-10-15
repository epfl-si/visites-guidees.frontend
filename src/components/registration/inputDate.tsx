import { useMemo } from "react"
import { useFormContext } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { FieldError, FieldLabel } from "@/components/registration/field"
import { InputCalendar } from "@/components/registration/inputCalendar"
import {
  earliestVisitDate,
  MIN_BUSINESS_DAYS,
  type RegistrationValues,
} from "@/validations/registration"

export const InputDate = () => {
  const { t } = useTranslation()
  const {
    formState: { errors },
  } = useFormContext<RegistrationValues>()
  const minVisitDate = useMemo(
    () => earliestVisitDate(new Date(), MIN_BUSINESS_DAYS),
    []
  )

  return (
    <div className="flex flex-col gap-1.5">
      <FieldLabel required>{t("registration.date.label")}</FieldLabel>
      <InputCalendar minDate={minVisitDate} />
      {/* Date and time share one trigger: show a single message, date first. */}
      <FieldError message={errors.date?.message ?? errors.time?.message} />
      <p className="text-sm text-muted-foreground">
        {t("registration.date.hint")}
      </p>
    </div>
  )
}
