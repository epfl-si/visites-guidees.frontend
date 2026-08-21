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
  NumberFieldScrubArea,
} from "@/components/reui/number-field"
import { ChevronDownIcon, ChevronUpIcon } from 'lucide-react'
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import { useState, useEffect, useMemo, type FormEvent } from "react";
import type { PlaceInformationType, RegistrationFormType } from "@/types/register";
import countryList from "react-select-country-list";
import { postRegistration } from "@/services/reservation";

const LOCAL_STORAGE_KEY = "registrationFormData";

// Business-day calculation shared logic (kept in sync with backend's
// isAtLeast7BusinessDaysBefore). If you can, extract this into a shared
// package so front and back never drift apart again.
const MIN_BUSINESS_DAYS = 7;

function countBusinessDaysBetween(from: Date, to: Date): number {
  let count = 0;
  const cursor = new Date(from);
  cursor.setHours(0, 0, 0, 0);
  const end = new Date(to);
  end.setHours(0, 0, 0, 0);

  while (cursor < end) {
    cursor.setDate(cursor.getDate() + 1);
    const day = cursor.getDay();
    if (day !== 0 && day !== 6) {
      count++;
    }
  }
  return count;
}

const initialFormData: RegistrationFormType = {
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
  visitDate: "",
  visitTime: "",
  participantNumber: 1,
  languageId: 0,
  comment: "",
  gdprConsent: false,
};

export default function RegistrationForm({
  information,
}: {
  information: PlaceInformationType;
}) {
  const { t } = useTranslation();
  const [formData, setFormData] = useState<RegistrationFormType>(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const countryOptions = useMemo(() => countryList().getData(), []);

  function updateField<K extends keyof RegistrationFormType>(
    field: K,
    value: RegistrationFormType[K]
  ) {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }

  const checkDate = (date: string, time: string, minBusinessDays: number) => {
    const selectedDateTime = new Date(`${date}T${time}`);
    if (Number.isNaN(selectedDateTime.getTime())) {
      alert(t("registration.date.invalid"));
      return false;
    }
    const businessDays = countBusinessDaysBetween(new Date(), selectedDateTime);
    if (businessDays < minBusinessDays) {
      alert(t("registration.date.tooSoon", { maxTime: minBusinessDays }));
      return false;
    }
    return true;
  };

  useEffect(() => {
    const savedFormData = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (savedFormData) {
      try {
        setFormData(JSON.parse(savedFormData));
      } catch {
        localStorage.removeItem(LOCAL_STORAGE_KEY);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(formData));
  }, [formData]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!formData.gdprConsent) {
      alert(t("registration.gdpr.consentRequired"));
      return;
    }

    const requiredStringFields: (keyof RegistrationFormType)[] = [
      "firstName",
      "lastName",
      "email",
      "phone",
      "visitDate",
      "visitTime",
      "participantNumber",
      "country",
      "city",
      "region",
      "zip",
      "address",
    ];
    const hasMissingField =
      requiredStringFields.some((field) => !formData[field]) || formData.languageId === 0;
    if (hasMissingField) {
      alert(t("registration.requiredFieldsMissing"));
      return;
    }

    if (!checkDate(formData.visitDate, formData.visitTime, MIN_BUSINESS_DAYS)) {
      return;
    }

    const isoDate = new Date(`${formData.visitDate}T${formData.visitTime}`).toISOString();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { visitTime,visitDate, ...rest } = formData;
    // Backend expects `numberOfParticipant` (singular) — see reservations schema.
    // Mapped here rather than renaming the front-end type.
    const formDataToSubmit = {
      ...rest,
      date: isoDate,
      placeId: information.id,
      participantNumber: Number(rest.participantNumber)
    };

    setIsSubmitting(true);
    try {
      await postRegistration(
        formDataToSubmit
      );
      alert(t("registration.submitSuccess"));
      setFormData(initialFormData);
      localStorage.removeItem(LOCAL_STORAGE_KEY);
    } catch (error) {
      console.error("Registration submission failed: ", error);
      alert(t("registration.submitError"));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className="flex w-full max-w-md flex-col gap-5" onSubmit={handleSubmit}>
      <div className="flex flex-col gap-1.5">
        <Label>
          {t("registration.organizerName.label")}{" "}
          <span className="text-destructive">*</span>
        </Label>
        <div className="grid grid-cols-2 gap-3">
          <Input
            placeholder={t("registration.organizerName.firstNamePlaceholder")}
            value={formData.firstName}
            onChange={(e) => updateField("firstName", e.target.value)}
            required
          />
          <Input
            placeholder={t("registration.organizerName.lastNamePlaceholder")}
            value={formData.lastName}
            onChange={(e) => updateField("lastName", e.target.value)}
            required
          />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label>{t("registration.company.label")}</Label>
        <Input
          value={formData.company}
          onChange={(e) => updateField("company", e.target.value)}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label>
          {t("registration.email.label")} <span className="text-destructive">*</span>
        </Label>
        <Input
          type="email"
          value={formData.email}
          onChange={(e) => updateField("email", e.target.value)}
          required
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label>
          {t("registration.phone.label")} <span className="text-destructive">*</span>
        </Label>
        <Input
          type="tel"
          value={formData.phone}
          onChange={(e) => updateField("phone", e.target.value)}
          required
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label>
          {t("registration.address.label")} <span className="text-destructive">*</span>
        </Label>
        <Input
          placeholder={t("registration.address.addressPlaceholder")}
          value={formData.address}
          onChange={(e) => updateField("address", e.target.value)}
          required
        />
        <Input
          placeholder={t("registration.address.complementPlaceholder")}
          value={formData.additionalAddress}
          onChange={(e) => updateField("additionalAddress", e.target.value)}
        />
        <div className="grid grid-cols-2 gap-3">
          <Input
            placeholder={t("registration.address.cityPlaceholder")}
            value={formData.city}
            onChange={(e) => updateField("city", e.target.value)}
            required
          />
          <Input
            placeholder={t("registration.address.regionPlaceholder")}
            value={formData.region}
            onChange={(e) => updateField("region", e.target.value)}
            required
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Input
            placeholder={t("registration.address.postalCodePlaceholder")}
            value={formData.zip}
            onChange={(e) => updateField("zip", e.target.value)}
            required
          />
          <Select
            value={formData.country}
            onValueChange={(value) => {
              if (value !== null) updateField("country", value);
            }}
          >
            <SelectTrigger className="w-full">
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
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label>
          {t("registration.date.label")} <span className="text-destructive">*</span>
        </Label>
        <div className="grid grid-cols-2 gap-3">
          <Input
            type="date"
            value={formData.visitDate}
            onChange={(e) => updateField("visitDate", e.target.value)}
            required
          />
          <Input
            type="time"
            value={formData.visitTime}
            onChange={(e) => updateField("visitTime", e.target.value)}
            required
          />
        </div>
        <p className="text-sm text-muted-foreground">{t("registration.date.hint")}</p>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label>
          {t("registration.participants.label")} <span className="text-destructive">*</span>
        </Label>
        <NumberField
          min={0} max={100}
          value={formData.participantNumber}
          onValueChange={(value) =>{
            if (value !== null) updateField("participantNumber", value)
          }}>
          <NumberFieldGroup>
            <NumberFieldInput className="text-start" />
            <div className="border-input bg-muted/30 rounded-lg m-px flex shrink-0 flex-col overflow-hidden border">
              <NumberFieldIncrement className="border-input hover:bg-accent focus-visible:bg-accent flex h-3.5 w-full flex-1 shrink-0 items-center rounded-none! border-b px-1.5 leading-none">
                <ChevronUpIcon  className="size-3.5" />
              </NumberFieldIncrement>
              <NumberFieldDecrement className="hover:bg-accent focus-visible:bg-accent flex h-3.5 w-full flex-1 shrink-0 items-center rounded-none! px-1.5 leading-none">
                <ChevronDownIcon  className="size-3.5" />
              </NumberFieldDecrement>
            </div>
          </NumberFieldGroup>
        </NumberField>
      </div>

      <div className="flex flex-col gap-2">
        <Label>
          {t("registration.language.label")} <span className="text-destructive">*</span>
        </Label>
        <RadioGroup
          value={String(formData.languageId)}
          onValueChange={(value) => updateField("languageId", Number(value))}
          className="grid-flow-col justify-start gap-8"
        >
          {information.languages.map((l) => (
            <Label className="font-normal" key={l.id}>
              <RadioGroupItem value={String(l.id)} /> {l.name}
            </Label>
          ))}
        </RadioGroup>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label>{t("registration.comments.label")}</Label>
        <Textarea
          value={formData.comment}
          onChange={(e) => updateField("comment", e.target.value)}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label>
          {t("registration.gdpr.label")} <span className="text-destructive">*</span>
        </Label>
        <Label className="font-normal">
          <Checkbox
            checked={formData.gdprConsent}
            onCheckedChange={(checked) => updateField("gdprConsent", checked === true)}
            required
          />
          {t("registration.gdpr.consent")}
        </Label>
        <p className="text-sm text-muted-foreground">{t("registration.gdpr.hint")}</p>
      </div>

      <Button type="submit" className="self-start" disabled={isSubmitting}>
        {isSubmitting ? t("registration.submitting") : t("registration.submit")}
      </Button>
    </form>
  );
}
