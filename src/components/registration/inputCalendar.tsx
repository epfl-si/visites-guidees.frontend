import { useState } from "react"
import { format, parseISO } from "date-fns"
import { enUS, fr } from "date-fns/locale"
import { CalendarIcon } from "lucide-react"
import { useController, useFormContext } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import type { RegistrationValues } from "@/validations/registration"

const dateFormats = {
  fr: { locale: fr, pattern: "EEEE d MMMM yyyy" },
  en: { locale: enUS, pattern: "EEEE, MMMM d, yyyy" },
}

export const InputCalendar = ({ minDate }: { minDate: string }) => {
  const { t, i18n } = useTranslation()
  const {
    control,
    register,
    watch,
    formState: { errors },
  } = useFormContext<RegistrationValues>()
  const {
    field: { value, onChange, onBlur, ref },
    fieldState,
  } = useController({ control, name: "date" })
  const time = watch("time")
  const timeInvalid = !!errors.time
  const [open, setOpen] = useState(false)

  const { locale, pattern } =
    i18n.resolvedLanguage === "fr" ? dateFormats.fr : dateFormats.en
  const selected = value ? parseISO(value) : undefined
  const earliest = parseISO(minDate)

  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen)
    if (!nextOpen) onBlur()
  }

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger
        render={
          <Button
            ref={ref}
            variant="outline"
            aria-invalid={fieldState.invalid || timeInvalid}
            className={cn(
              "w-full justify-start font-normal",
              !selected && "text-muted-foreground"
            )}
          />
        }
      >
        <CalendarIcon />
        {selected ? (
          <span className="first-letter:uppercase">
            {format(selected, pattern, { locale })}
            {" · "}
            <span className={cn(!time && "text-muted-foreground")}>
              {time || "--:--"}
            </span>
          </span>
        ) : (
          t("registration.date.placeholder")
        )}
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          locale={locale}
          selected={selected}
          defaultMonth={selected ?? earliest}
          disabled={{ before: earliest }}
          onSelect={(date) => onChange(date ? format(date, "yyyy-MM-dd") : "")}
          className="p-3 [--cell-size:--spacing(10)]"
        />
        <div className="flex items-center gap-2 border-t p-3">
          <Label htmlFor="registration-time">
            {t("registration.date.time")}
          </Label>
          <Input
            id="registration-time"
            type="time"
            aria-invalid={timeInvalid}
            className="flex-1"
            {...register("time")}
          />
          <Button onClick={() => handleOpenChange(false)}>
            {t("registration.date.confirm")}
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  )
}
