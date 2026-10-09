import { z } from "zod"

export type CommonSchemaMessages = {
  required: string
  invalidEmail: string
}

// Default messages (English) for non-localized use — the form always
// validates with translated messages from the factories.
export const defaultSchemaMessages: CommonSchemaMessages = {
  required: "Required",
  invalidEmail: "Invalid email",
}

export function requiredString(msgs: Pick<CommonSchemaMessages, "required">) {
  return z.string().min(1, { error: msgs.required })
}
