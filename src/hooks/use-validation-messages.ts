import { useMemo } from "react"
import { useTranslation } from "react-i18next"
import type { CommonSchemaMessages } from "@/validations/common"
import {
  MIN_BUSINESS_DAYS,
  type RegistrationSchemaMessages,
} from "@/validations/registration"

export function useValidationMessages(): CommonSchemaMessages {
  const { t } = useTranslation()
  return useMemo(
    () => ({
      required: t("common.validation.required"),
      invalidEmail: t("common.validation.invalidEmail"),
    }),
    [t]
  )
}

export function useRegistrationValidationMessages(): RegistrationSchemaMessages {
  const { t } = useTranslation()
  const common = useValidationMessages()
  return useMemo(
    () => ({
      ...common,
      invalidPhone: t("registration.phone.invalid"),
      invalidCountry: t("registration.address.countryInvalid"),
      invalidDate: t("registration.date.invalid"),
      dateTooSoon: t("registration.date.tooSoon", {
        maxTime: MIN_BUSINESS_DAYS,
      }),
      participantsMin: t("registration.participants.min"),
      participantsInteger: t("registration.participants.integer"),
      languageRequired: t("registration.language.required"),
      gdprRequired: t("registration.gdpr.consentRequired"),
    }),
    [t, common]
  )
}
