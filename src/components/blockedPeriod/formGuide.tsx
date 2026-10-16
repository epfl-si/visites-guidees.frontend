import * as React from "react"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { Calendar as CalendarIcon } from "lucide-react"
import type { DateRange } from "react-day-picker"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { createBlockedPeriodForGuide } from "@/services/guide"
import type { BlockedPeriod } from "@/types/blockedPeriod"
import { toast } from "sonner"

export function BlockedPeriodFormGuide({
  onCreateBlockedPeriodes,
}: {
  onCreateBlockedPeriodes: (blockedPeriod: BlockedPeriod) => void
}
) {
  const [date, setDate] = React.useState<DateRange | undefined>({
    from: new Date(),
    to: new Date(new Date().setDate(new Date().getDate() + 5)),
  })

  const validate = async () => {
    if (!date || !date.from || !date.to) {
      toast.warning("Veuillez remplir les dates de l'absence.")
      return;
    }
    createBlockedPeriodForGuide(date.from, date.to)
      .then((res) => {
        if (res.success) {
          onCreateBlockedPeriodes(res.data);
          setDate(undefined);
          toast.success("Absence créer avec succès.");
          return;
        }
        toast.error("Impossible de créer une absence.")
      })
      .catch(() => toast.error("Impossible de créer une absence."))
  }

  return (
    <div className="grid gap-4">
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
          Ajouter une nouvelle période bloquée
        </label>

        <Popover>
          <PopoverTrigger>
            <Button
              id="date"
              variant={"outline"}
              className={cn(
                "w-75 justify-start text-left font-normal",
                !date && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date?.from ? (
                date.to ? (
                  <>
                    {format(date.from, "dd LLL y", { locale: fr })} -{" "}
                    {format(date.to, "dd LLL y", { locale: fr })}
                  </>
                ) : (
                  format(date.from, "dd LLL y", { locale: fr })
                )
              ) : (
                <span>Sélectionnez les dates</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="range"
              defaultMonth={date?.from}
              selected={date}
              onSelect={setDate}
              numberOfMonths={2}
              locale={fr}
            />
          </PopoverContent>
        </Popover>
      </div>

      <Button onClick={validate} className="w-75">
        Valider
      </Button>
    </div>
  )
}
