import { useFormContext } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { Input } from "@/components/ui/input"
import { FieldError, FieldLabel } from "@/components/registration/field"
import type { RegistrationValues } from "@/validations/registration"

export const InputDate = () => {
  const { t } = useTranslation()
  const {
    register,
    formState: { errors },
  } = useFormContext<RegistrationValues>()

  return (
    <div className="flex flex-col gap-1.5">
      <FieldLabel required>{t("registration.date.label")}</FieldLabel>
      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1">
          <Input
            type="date"
            aria-invalid={!!errors.date}
            {...register("date")}
          />
          <FieldError message={errors.date?.message} />
        </div>
        <div className="flex flex-col gap-1">
          <Input
            type="time"
            aria-invalid={!!errors.time}
            {...register("time")}
          />
          <FieldError message={errors.time?.message} />
        </div>
      </div>
      <p className="text-sm text-muted-foreground">
        {t("registration.date.hint")}
      </p>
    </div>
  )
}
