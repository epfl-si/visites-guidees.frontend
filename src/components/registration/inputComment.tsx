import { useFormContext } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { Textarea } from "@/components/ui/textarea"
import { FieldLabel } from "@/components/registration/field"
import type { RegistrationValues } from "@/validations/registration"

export const InputComment = () => {
  const { t } = useTranslation()
  const { register } = useFormContext<RegistrationValues>()

  return (
    <div className="flex flex-col gap-1.5">
      <FieldLabel>{t("registration.comments.label")}</FieldLabel>
      <Textarea {...register("comment")} />
    </div>
  )
}
