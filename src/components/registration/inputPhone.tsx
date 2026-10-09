import { Controller, useFormContext } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { FieldError, FieldLabel } from "@/components/registration/field"
import type { RegistrationValues } from "@/validations/registration"
import { PhoneInput } from "@/components/reui/phone-input"

export const InputPhone = () => {
  const { t } = useTranslation()
  const {
    control,
    formState: { errors },
  } = useFormContext<RegistrationValues>()

  return (
    <div className="flex flex-col gap-1.5">
      <FieldLabel required>{t("registration.phone.label")}</FieldLabel>
      <Controller
        control={control}
        name="phone"
        render={({ field }) => (
          <PhoneInput
            ref={field.ref}
            name={field.name}
            value={field.value}
            onChange={field.onChange}
            onBlur={field.onBlur}
            placeholder={t("registration.phone.placeholder")}
            aria-invalid={!!errors.phone}
          />
        )}
      />
      <FieldError message={errors.phone?.message} />
    </div>
  )
}
