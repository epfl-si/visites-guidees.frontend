import { useFormContext } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { Input } from "@/components/ui/input"
import { FieldError, FieldLabel } from "@/components/registration/field"
import type { RegistrationValues } from "@/validations/registration"

export const InputEmail = () => {
  const { t } = useTranslation()
  const {
    register,
    formState: { errors },
  } = useFormContext<RegistrationValues>()

  return (
    <div className="flex flex-col gap-1.5">
      <FieldLabel required>{t("registration.email.label")}</FieldLabel>
      <Input
        type="email"
        aria-invalid={!!errors.email}
        {...register("email")}
      />
      <FieldError message={errors.email?.message} />
    </div>
  )
}
