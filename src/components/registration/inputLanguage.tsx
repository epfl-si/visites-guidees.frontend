import { Controller, useFormContext } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { FieldError, FieldLabel } from "@/components/registration/field"
import type { PlaceInformationType } from "@/types/place"
import type { RegistrationValues } from "@/validations/registration"

export const InputLanguage = ({
  languages,
}: {
  languages: PlaceInformationType["languages"]
}) => {
  const { t } = useTranslation()
  const {
    control,
    formState: { errors },
  } = useFormContext<RegistrationValues>()

  return (
    <div className="flex flex-col gap-2">
      <FieldLabel required>{t("registration.language.label")}</FieldLabel>
      <Controller
        control={control}
        name="languageId"
        render={({ field }) => (
          <RadioGroup
            value={String(field.value)}
            onValueChange={(value) => field.onChange(Number(value))}
            className="grid-flow-col justify-start gap-8"
          >
            {languages.map((l) => (
              <Label className="font-normal" key={l.id}>
                <RadioGroupItem value={String(l.id)} /> {l.name}
              </Label>
            ))}
          </RadioGroup>
        )}
      />
      <FieldError message={errors.languageId?.message} />
    </div>
  )
}
