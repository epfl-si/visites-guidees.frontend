import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  NumberField,
  NumberFieldDecrement,
  NumberFieldGroup,
  NumberFieldIncrement,
  NumberFieldInput,
} from "@/components/reui/number-field"
import { ChevronDownIcon, ChevronUpIcon } from 'lucide-react'
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import { useEffect, useMemo, useTransition } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import countryList from "react-select-country-list";
import { postRegistration } from "@/services/reservation";
import { toast } from "sonner";
import type { PlaceInformationType } from "@/types/place";
import { useRegistrationValidationMessages } from "@/hooks/use-validation-messages";
import { buildRegistrationSchema, type RegistrationValues } from "@/validations/registration";

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
};

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="text-sm text-destructive">{message}</p>;
}

export default function RegistrationForm({
  information,
}: {
  information: PlaceInformationType;
}) {
  const { t } = useTranslation();
  const validationMessages = useRegistrationValidationMessages();
  const schema = useMemo(() => buildRegistrationSchema(validationMessages), [validationMessages]);
  const {
    register,
    control,
    handleSubmit,
    reset,
    trigger,
    formState: { errors, isSubmitted },
  } = useForm<RegistrationValues>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  useEffect(() => {
    if (isSubmitted) trigger();
  }, [schema, isSubmitted, trigger]);
  const [isSubmitting, startTransition] = useTransition();
  const countryOptions = useMemo(() => countryList().getData(), []);

  const onSubmit = (values: RegistrationValues) => {
    startTransition(async () => {
      const { time, ...rest } = values;
      try {
        const response = await postRegistration({
          ...rest,
          date: new Date(`${values.date}T${time}`).toISOString(),
          placeId: information.id,
        });
        if (!response.success) {
          throw new Error(response.error);
        }
        toast.success(t("registration.submitSuccess"));
        reset(defaultValues);
      } catch {
        toast.error(t("registration.submitError"));
      }
    });
  };

  return (
    <form className="flex w-full max-w-3xl flex-col gap-5 m-3" onSubmit={handleSubmit(onSubmit)} noValidate>
      <div className="flex flex-col gap-1.5">
        <Label>
          {t("registration.organizerName.label")}{" "}
          <span className="text-destructive">*</span>
        </Label>
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

      <div className="flex flex-col gap-1.5">
        <Label>
          {t("registration.email.label")} <span className="text-destructive">*</span>
        </Label>
        <Input type="email" aria-invalid={!!errors.email} {...register("email")} />
        <FieldError message={errors.email?.message} />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label>
          {t("registration.phone.label")} <span className="text-destructive">*</span>
        </Label>
        <Input type="tel" placeholder="+41216931234" aria-invalid={!!errors.phone} {...register("phone")} />
        <FieldError message={errors.phone?.message} />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label>
          {t("registration.address.label")} <span className="text-destructive">*</span>
        </Label>
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
                    if (value !== null) field.onChange(value);
                  }}
                >
                  <SelectTrigger className="w-full" aria-invalid={!!errors.country}>
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

      <div className="flex flex-col gap-1.5">
        <Label>
          {t("registration.date.label")} <span className="text-destructive">*</span>
        </Label>
        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-1">
            <Input type="date" aria-invalid={!!errors.date} {...register("date")} />
            <FieldError message={errors.date?.message} />
          </div>
          <div className="flex flex-col gap-1">
            <Input type="time" aria-invalid={!!errors.time} {...register("time")} />
            <FieldError message={errors.time?.message} />
          </div>
        </div>
        <p className="text-sm text-muted-foreground">{t("registration.date.hint")}</p>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label>
          {t("registration.participants.label")} <span className="text-destructive">*</span>
        </Label>
        <Controller
          control={control}
          name="participantNumber"
          render={({ field }) => (
            <NumberField
              min={1} max={100}
              value={field.value}
              onValueChange={(value) => {
                if (value !== null) field.onChange(value)
              }}>
              <NumberFieldGroup>
                <NumberFieldInput className="text-start" />
                <div className="border-input bg-muted/30 rounded-lg m-px flex shrink-0 flex-col overflow-hidden border">
                  <NumberFieldIncrement className="border-input hover:bg-accent focus-visible:bg-accent flex h-3.5 w-full flex-1 shrink-0 items-center rounded-none! border-b px-1.5 leading-none">
                    <ChevronUpIcon className="size-3.5" />
                  </NumberFieldIncrement>
                  <NumberFieldDecrement className="hover:bg-accent focus-visible:bg-accent flex h-3.5 w-full flex-1 shrink-0 items-center rounded-none! px-1.5 leading-none">
                    <ChevronDownIcon className="size-3.5" />
                  </NumberFieldDecrement>
                </div>
              </NumberFieldGroup>
            </NumberField>
          )}
        />
        <FieldError message={errors.participantNumber?.message} />
      </div>

      <div className="flex flex-col gap-2">
        <Label>
          {t("registration.language.label")} <span className="text-destructive">*</span>
        </Label>
        <Controller
          control={control}
          name="languageId"
          render={({ field }) => (
            <RadioGroup
              value={String(field.value)}
              onValueChange={(value) => field.onChange(Number(value))}
              className="grid-flow-col justify-start gap-8"
            >
              {information.languages.map((l) => (
                <Label className="font-normal" key={l.id}>
                  <RadioGroupItem value={String(l.id)} /> {l.name}
                </Label>
              ))}
            </RadioGroup>
          )}
        />
        <FieldError message={errors.languageId?.message} />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label>{t("registration.comments.label")}</Label>
        <Textarea {...register("comment")} />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label>
          {t("registration.gdpr.label")} <span className="text-destructive">*</span>
        </Label>
        <Label className="font-normal">
          <Controller
            control={control}
            name="gdprConsent"
            render={({ field }) => (
              <Checkbox
                checked={field.value}
                onCheckedChange={(checked) => field.onChange(checked === true)}
                aria-invalid={!!errors.gdprConsent}
              />
            )}
          />
          {t("registration.gdpr.consent")}
        </Label>
        <FieldError message={errors.gdprConsent?.message} />
        <p className="text-sm text-muted-foreground">{t("registration.gdpr.hint")}</p>
      </div>

      <Button type="submit" className="self-start" disabled={isSubmitting}>
        {isSubmitting ? t("registration.submitting") : t("registration.submit")}
      </Button>
    </form>
  );
}
