import { useFormContext } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { Input } from "@/components/ui/input"
import { FieldError, FieldLabel } from "@/components/registration/field"
import type { RegistrationValues } from "@/validations/registration"

export const InputName = () => {
  const { t } = useTranslation()
  const {
    register,
    formState: { errors },
  } = useFormContext<RegistrationValues>()

  return (
    <div className="flex flex-col gap-1.5">
      <FieldLabel required>{t("registration.organizerName.label")}</FieldLabel>
      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1">
          <Input
            placeholder={t("registration.organizerName.firstNamePlaceholder")}
            aria-invalid={!!errors.firstName}
            {...register("firstName")}
          />
          <FieldError message={errors.firstName?.message} />
        </div>
        <div className="flex flex-col gap-1">
          <Input
            placeholder={t("registration.organizerName.lastNamePlaceholder")}
            aria-invalid={!!errors.lastName}
            {...register("lastName")}
          />
          <FieldError message={errors.lastName?.message} />
        </div>
      </div>
    </div>
  )
}
