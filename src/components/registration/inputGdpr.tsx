import { Controller, useFormContext } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { FieldError, FieldLabel } from "@/components/registration/field"
import type { RegistrationValues } from "@/validations/registration"

export const InputGdpr = () => {
  const { t } = useTranslation()
  const {
    control,
    formState: { errors },
  } = useFormContext<RegistrationValues>()

  return (
    <div className="flex flex-col gap-1.5">
      <FieldLabel required>{t("registration.gdpr.label")}</FieldLabel>
      <Label className="font-normal">
        <Controller
          control={control}
          name="gdprConsent"
          render={({ field }) => (
            <Checkbox
              checked={field.value}
              onCheckedChange={(checked) => field.onChange(checked === true)}
              aria-invalid={!!errors.gdprConsent}
            />
          )}
        />
        {t("registration.gdpr.consent")}
      </Label>
      <FieldError message={errors.gdprConsent?.message} />
      <p className="text-sm text-muted-foreground">
        {t("registration.gdpr.hint")}
      </p>
    </div>
  )
}
