import { useFormContext } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { Input } from "@/components/ui/input"
import { FieldLabel } from "@/components/registration/field"
import type { RegistrationValues } from "@/validations/registration"

export const InputCompany = () => {
  const { t } = useTranslation()
  const { register } = useFormContext<RegistrationValues>()

  return (
    <div className="flex flex-col gap-1.5">
      <FieldLabel>{t("registration.company.label")}</FieldLabel>
      <Input {...register("company")} />
    </div>
  )
}
