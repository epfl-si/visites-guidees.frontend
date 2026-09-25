import { CirclePlus, UserRound } from "lucide-react"
import { useState } from "react"
import type { Dispatch, SetStateAction } from "react"
import { useTranslation } from "react-i18next"
import Stepper from "@/components/stepper"
import { buttonVariants } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { cn } from "@/lib/utils"
import { getGuide } from "@/services/guide"
import type { CreateGuide, Guide } from "@/types/guide"
import type { Language } from "@/types/language"
import type { Place } from "@/types/place"
import type { ResponseUserAPI } from "@/types/user"
import { ADD_GUIDE_STEPS, EMPTY_CREATE_GUIDE } from "@/constants/guide"
import { ConfirmGuide } from "./confirmGuide"
import { SelectGuide } from "./selectGuide"
import { SelectLanguage } from "./selectLanguage"
import { SelectPlace } from "./selectPlace"
import { SelectStartDate } from "./selectStartDate"

export const AddGuideDialog = ({ guides, setGuides }: { guides: Guide[], setGuides: Dispatch<SetStateAction<Guide[]>> }) => {
  const { t } = useTranslation()
  const [step, setStep] = useState<number>(1)
  const [selectedGuide, setSelectedGuide] = useState<ResponseUserAPI | null>(
    null
  )
  const [selectedInformation, setSelectedInformation] =
    useState<CreateGuide>(EMPTY_CREATE_GUIDE)
  const [languages, setLanguages] = useState<Language[]>([])
  const [places, setPlaces] = useState<Place[]>([])
  const [open, setOpen] = useState<boolean>(false)

  const current = ADD_GUIDE_STEPS[step - 1]
  const StepIcon = current.icon

  async function AddGuideInTable() {
    const response = await getGuide(selectedInformation.sciper)
    if (!response.success) {
      if (response.code === 401) return
      throw new Error(response.error)
    }
    setGuides([
      ...guides,
      response.data
    ]);
  }

  async function handleOpenChange(open: boolean) {
    setOpen(open)
    if (open) return
    setStep(1)
    setSelectedGuide(null)
    setSelectedInformation(EMPTY_CREATE_GUIDE)
  }

  function handleGuideSelect(user: ResponseUserAPI) {
    setSelectedGuide(user)
    setSelectedInformation((prev) => ({ ...prev, sciper: Number(user.sciper) }))
    setStep(2)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger
        className={cn(buttonVariants(), "flex items-center gap-2 text-nowrap")}
      >
        {t("guide.add")}
        <CirclePlus />
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader className="gap-4">
          <DialogTitle className="text-lg font-semibold">
            {t("guide.add")}
          </DialogTitle>
          <Stepper value={step} numberOfSteps={ADD_GUIDE_STEPS.length} />
          <div className="flex items-start gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <StepIcon className="size-5" />
            </div>
            <div className="flex flex-col gap-1.5">
              <span className="text-xs text-muted-foreground">
                {t("guide.dialog.step", {
                  current: step,
                  total: ADD_GUIDE_STEPS.length,
                })}
              </span>
              <h3 className="font-medium">
                {t(`guide.dialog.${current.key}.title`)}
              </h3>
              <DialogDescription>
                {t(`guide.dialog.${current.key}.description`)}
              </DialogDescription>
            </div>
          </div>
          {selectedGuide && step > 1 && (
            <div className="flex items-center gap-2 rounded-lg bg-muted/50 px-3 py-2 text-sm">
              <UserRound className="size-4 text-muted-foreground" />
              <span className="font-medium">
                {selectedGuide.firstName} {selectedGuide.lastName}
              </span>
              <span className="text-muted-foreground">
                {selectedGuide.sciper}
              </span>
            </div>
          )}
        </DialogHeader>
        {(() => {
          switch (step) {
            case 1:
              return <SelectGuide onSelect={handleGuideSelect} />
            case 2:
              return (
                <SelectLanguage
                  setStep={setStep}
                  selectedInformation={selectedInformation}
                  setSelectedInformation={setSelectedInformation}
                  languages={languages}
                  setLanguages={setLanguages}
                />
              )
            case 3:
              return (
                <SelectPlace
                  setStep={setStep}
                  selectedInformation={selectedInformation}
                  setSelectedInformation={setSelectedInformation}
                  places={places}
                  setPlaces={setPlaces}
                />
              )
            case 4:
              return (
                <SelectStartDate
                  setStep={setStep}
                  selectedInformation={selectedInformation}
                  setSelectedInformation={setSelectedInformation}
                />
              )
            default:
              return (
                <ConfirmGuide
                  setStep={setStep}
                  selectedGuide={selectedGuide}
                  selectedInformation={selectedInformation}
                  languages={languages}
                  places={places}
                  onAdded={() => (handleOpenChange(false), AddGuideInTable())}
                />
              )
          }
        })()}
      </DialogContent>
    </Dialog>
  )
}
