import { Button } from "@/components/ui/button"
import { useTranslation } from "react-i18next"
import { useEffect, useMemo, useTransition } from "react"
import { FormProvider, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { postRegistration } from "@/services/reservation"
import { toast } from "sonner"
import type { PlaceInformationType } from "@/types/place"
import { useRegistrationValidationMessages } from "@/hooks/use-validation-messages"
import {
  buildRegistrationSchema,
  type RegistrationValues,
} from "@/validations/registration"
import { InputName } from "@/components/registration/inputName"
import { InputCompany } from "@/components/registration/inputCompany"
import { InputEmail } from "@/components/registration/inputEmail"
import { InputPhone } from "@/components/registration/inputPhone"
import { InputAddress } from "@/components/registration/inputAddress"
import { InputDate } from "@/components/registration/inputDate"
import { InputParticipants } from "@/components/registration/inputParticipants"
import { InputLanguage } from "@/components/registration/inputLanguage"
import { InputComment } from "@/components/registration/inputComment"
import { InputGdpr } from "@/components/registration/inputGdpr"

const defaultValues: RegistrationValues = {
  firstName: "",
  lastName: "",
  company: "",
  email: "",
  phone: "",
  address: "",
  additionalAddress: "",
  city: "",
  region: "",
  zip: "",
  country: "CH",
  date: "",
  time: "",
  participantNumber: 1,
  languageId: 0,
  comment: "",
  gdprConsent: false,
}

export default function RegistrationForm({
  information,
}: {
  information: PlaceInformationType
}) {
  const { t } = useTranslation()
  const validationMessages = useRegistrationValidationMessages()
  const schema = useMemo(
    () => buildRegistrationSchema(validationMessages),
    [validationMessages]
  )
  const form = useForm<RegistrationValues>({
    resolver: zodResolver(schema),
    defaultValues,
  })
  const {
    handleSubmit,
    reset,
    trigger,
    formState: { isSubmitted },
  } = form

  // Error messages are computed at validation time: revalidate on locale
  // switch so the displayed errors follow the new language.
  useEffect(() => {
    if (isSubmitted) trigger()
  }, [schema, isSubmitted, trigger])
  const [isSubmitting, startTransition] = useTransition()

  const onSubmit = (values: RegistrationValues) => {
    startTransition(async () => {
      const { time, ...rest } = values
      try {
        const response = await postRegistration({
          ...rest,
          date: new Date(`${values.date}T${time}`).toISOString(),
          placeId: information.id,
        })
        if (!response.success) {
          throw new Error(response.error)
        }
        toast.success(t("registration.submitSuccess"))
        reset(defaultValues)
      } catch {
        toast.error(t("registration.submitError"))
      }
    })
  }

  return (
    <FormProvider {...form}>
      <form
        className="m-3 flex w-full max-w-3xl flex-col gap-5"
        onSubmit={handleSubmit(onSubmit)}
        noValidate
      >
        <InputName />
        <InputCompany />
        <InputEmail />
        <InputPhone />
        <InputAddress />
        <InputDate />
        <InputParticipants />
        <InputLanguage languages={information.languages} />
        <InputComment />
        <InputGdpr />

        <Button type="submit" className="self-start" disabled={isSubmitting}>
          {isSubmitting
            ? t("registration.submitting")
            : t("registration.submit")}
        </Button>
      </form>
    </FormProvider>
  )
}
