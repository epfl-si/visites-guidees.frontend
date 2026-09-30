import { z } from "zod"
import countryList from "react-select-country-list"
import {
  requiredString,
  defaultSchemaMessages,
  type CommonSchemaMessages,
} from "./common"

// Business-day calculation shared logic (kept in sync with backend's
// isAtLeast7BusinessDaysBefore). If you can, extract this into a shared
// package so front and back never drift apart again.
export const MIN_BUSINESS_DAYS = 7

function countBusinessDaysBetween(from: Date, to: Date): number {
  let count = 0
  const cursor = new Date(from)
  cursor.setHours(0, 0, 0, 0)
  const end = new Date(to)
  end.setHours(0, 0, 0, 0)

  while (cursor < end) {
    cursor.setDate(cursor.getDate() + 1)
    const day = cursor.getDay()
    if (day !== 0 && day !== 6) {
      count++
    }
  }
  return count
}

const countryCodes = countryList().getValues()

export type RegistrationSchemaMessages = CommonSchemaMessages & {
  invalidPhone: string
  invalidCountry: string
  invalidDate: string
  dateTooSoon: string
  participantsMin: string
  languageRequired: string
  gdprRequired: string
}

export const defaultRegistrationSchemaMessages: RegistrationSchemaMessages = {
  ...defaultSchemaMessages,
  invalidPhone: "Invalid phone number (expected format: +41216931234)",
  invalidCountry: "Invalid country",
  invalidDate: "Invalid date or time",
  dateTooSoon: `The date must be at least ${MIN_BUSINESS_DAYS} business days from now`,
  participantsMin: "At least 1 participant",
  languageRequired: "Please choose a language",
  gdprRequired: "You must accept the GDPR consent",
}

export function buildRegistrationSchema(msgs: RegistrationSchemaMessages) {
  return z
    .object({
      firstName: requiredString(msgs),
      lastName: requiredString(msgs),
      company: z.string(),
      email: z.email({ error: msgs.invalidEmail }),
      phone: z.e164({ error: msgs.invalidPhone }),
      address: requiredString(msgs),
      additionalAddress: z.string(),
      city: requiredString(msgs),
      region: requiredString(msgs),
      zip: requiredString(msgs),
      country: z
        .string()
        .refine((val) => countryCodes.includes(val), {
          error: msgs.invalidCountry,
        }),
      date: z.iso.date({ error: msgs.required }),
      time: z.iso.time({ precision: -1, error: msgs.required }), // HH:MM
      participantNumber: z
        .number()
        .int()
        .min(1, { error: msgs.participantsMin }),
      languageId: z.number().int().positive({ error: msgs.languageRequired }),
      comment: z.string(),
      gdprConsent: z
        .boolean()
        .refine((val) => val, { error: msgs.gdprRequired }),
    })
    .superRefine(({ date, time }, ctx) => {
      if (!date || !time) return
      const selectedDateTime = new Date(`${date}T${time}`)
      if (Number.isNaN(selectedDateTime.getTime())) {
        ctx.addIssue({
          code: "custom",
          path: ["date"],
          message: msgs.invalidDate,
        })
        return
      }
      if (
        countBusinessDaysBetween(new Date(), selectedDateTime) <
        MIN_BUSINESS_DAYS
      ) {
        ctx.addIssue({
          code: "custom",
          path: ["date"],
          message: msgs.dateTooSoon,
        })
      }
    })
}

export const registrationSchema = buildRegistrationSchema(
  defaultRegistrationSchemaMessages
)
export type RegistrationValues = z.infer<typeof registrationSchema>
