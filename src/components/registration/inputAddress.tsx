import { useMemo } from "react"
import { Controller, useFormContext } from "react-hook-form"
import { useTranslation } from "react-i18next"
import countryList from "react-select-country-list"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { FieldError, FieldLabel } from "@/components/registration/field"
import type { RegistrationValues } from "@/validations/registration"

export const InputAddress = () => {
  const { t } = useTranslation()
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext<RegistrationValues>()
  const countryOptions = useMemo(() => countryList().getData(), [])

  return (
    <div className="flex flex-col gap-1.5">
      <FieldLabel required>{t("registration.address.label")}</FieldLabel>
      <Input
        placeholder={t("registration.address.addressPlaceholder")}
        aria-invalid={!!errors.address}
        {...register("address")}
      />
      <FieldError message={errors.address?.message} />
      <Input
        placeholder={t("registration.address.complementPlaceholder")}
        {...register("additionalAddress")}
      />
      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1">
          <Input
            placeholder={t("registration.address.cityPlaceholder")}
            aria-invalid={!!errors.city}
            {...register("city")}
          />
          <FieldError message={errors.city?.message} />
        </div>
        <div className="flex flex-col gap-1">
          <Input
            placeholder={t("registration.address.regionPlaceholder")}
            aria-invalid={!!errors.region}
            {...register("region")}
          />
          <FieldError message={errors.region?.message} />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1">
          <Input
            placeholder={t("registration.address.postalCodePlaceholder")}
            aria-invalid={!!errors.zip}
            {...register("zip")}
          />
          <FieldError message={errors.zip?.message} />
        </div>
        <div className="flex flex-col gap-1">
          <Controller
            control={control}
            name="country"
            render={({ field }) => (
              <Select
                value={field.value}
                onValueChange={(value) => {
                  if (value !== null) field.onChange(value)
                }}
              >
                <SelectTrigger
                  className="w-full"
                  aria-invalid={!!errors.country}
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {countryOptions.map((country) => (
                    <SelectItem key={country.value} value={country.value}>
                      {country.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          <FieldError message={errors.country?.message} />
        </div>
      </div>
    </div>
  )
}
