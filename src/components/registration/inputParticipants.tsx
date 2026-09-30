import { ChevronDownIcon, ChevronUpIcon } from "lucide-react"
import { Controller, useFormContext } from "react-hook-form"
import { useTranslation } from "react-i18next"
import {
  NumberField,
  NumberFieldDecrement,
  NumberFieldGroup,
  NumberFieldIncrement,
  NumberFieldInput,
} from "@/components/reui/number-field"
import { FieldError, FieldLabel } from "@/components/registration/field"
import type { RegistrationValues } from "@/validations/registration"

export const InputParticipants = () => {
  const { t } = useTranslation()
  const {
    control,
    formState: { errors },
  } = useFormContext<RegistrationValues>()

  return (
    <div className="flex flex-col gap-1.5">
      <FieldLabel required>{t("registration.participants.label")}</FieldLabel>
      <Controller
        control={control}
        name="participantNumber"
        render={({ field }) => (
          <NumberField
            min={1}
            max={100}
            value={field.value}
            onValueChange={(value) => {
              if (value !== null) field.onChange(value)
            }}
          >
            <NumberFieldGroup>
              <NumberFieldInput className="text-start" />
              <div className="m-px flex shrink-0 flex-col overflow-hidden rounded-lg border border-input bg-muted/30">
                <NumberFieldIncrement className="flex h-3.5 w-full flex-1 shrink-0 items-center rounded-none! border-b border-input px-1.5 leading-none hover:bg-accent focus-visible:bg-accent">
                  <ChevronUpIcon className="size-3.5" />
                </NumberFieldIncrement>
                <NumberFieldDecrement className="flex h-3.5 w-full flex-1 shrink-0 items-center rounded-none! px-1.5 leading-none hover:bg-accent focus-visible:bg-accent">
                  <ChevronDownIcon className="size-3.5" />
                </NumberFieldDecrement>
              </div>
            </NumberFieldGroup>
          </NumberField>
        )}
      />
      <FieldError message={errors.participantNumber?.message} />
    </div>
  )
}
