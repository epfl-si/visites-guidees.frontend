import { useFormContext } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { Input } from "@/components/ui/input"
import { FieldError, FieldLabel } from "@/components/registration/field"
import type { RegistrationValues } from "@/validations/registration"

export const InputPhone = () => {
  const { t } = useTranslation()
  const {
    register,
    formState: { errors },
  } = useFormContext<RegistrationValues>()

  return (
    <div className="flex flex-col gap-1.5">
      <FieldLabel required>{t("registration.phone.label")}</FieldLabel>
      <Input
        type="tel"
        placeholder="+41216931234"
        aria-invalid={!!errors.phone}
        {...register("phone")}
      />
      <FieldError message={errors.phone?.message} />
    </div>
  )
}
