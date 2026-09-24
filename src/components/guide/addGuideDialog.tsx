import {
  ArrowLeft,
  ArrowRight,
  Calendar,
  CircleCheck,
  CirclePlus,
  Languages,
  MapPin,
  Search,
  UserRound,
  UserSearch,
  Users,
} from "lucide-react"
import { useEffect, useState, useCallback } from "react"
import type { Dispatch, SetStateAction } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button, buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { searchUser } from "@/services/user"
import type { ResponseUserAPI } from "@/types/user"
import { Spinner } from "@/components/ui/spinner"
import { Skeleton } from "@/components/ui/skeleton"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group"
import { useTranslation } from "react-i18next"
import { toast } from "sonner"
import Stepper from "../stepper"
import type { Language } from "@/types/language"
import type { CreateGuide } from "@/types/guide"
import { getLanguages as getAvailableLanguages } from "@/services/language"
import { getPlaces as getAvailablePlaces } from "@/services/place"
import type { Place } from "@/types/place"

const STEPS = [
  { key: "guide", icon: UserSearch },
  { key: "language", icon: Languages },
  { key: "place", icon: MapPin },
  { key: "calendar", icon: Calendar },
  { key: "confirm", icon: CircleCheck },
] as const

const EMPTY_INFORMATION: CreateGuide = {
  sciper: 0,
  languageIds: [],
  placeIds: [],
  startDate: "",
}

const SelectGuide = ({
  onSelect,
}: {
  onSelect: (user: ResponseUserAPI) => void
}) => {
  const { t } = useTranslation()

  const [isWaiting, setIsWaiting] = useState<boolean>(false)
  const [hasSearched, setHasSearched] = useState<boolean>(false)
  const [users, setUsers] = useState<ResponseUserAPI[]>([])
  const [search, setSearch] = useState<string>("")

  const handleSearch = useCallback(async (query: string) => {
    if (!query) return

    setIsWaiting(true)
    try {
      const usersResponse = await searchUser(query)
      if (!usersResponse.success) {
        if (usersResponse.code === 401) {
          setUsers([])
          return
        }
        throw new Error(usersResponse.error)
      }
      setUsers(usersResponse.data)
    } catch {
      toast.error(t("guide.searchError"))
      setUsers([])
    } finally {
      setIsWaiting(false)
      setHasSearched(true)
    }
  }, [t])

  useEffect(() => {
    const searchUser = async () => {
      setHasSearched(false)

      if (!search) {
        setUsers([])
        return
      }

      const timeout = setTimeout(() => {
        handleSearch(search)
      }, 300)

      return () => clearTimeout(timeout)
    }
    searchUser();
  }, [search, handleSearch])

  const showNoResult =
    !isWaiting && hasSearched && users.length === 0 && search.trim() !== ""

  return (
    <div className="flex flex-col gap-3">
      <InputGroup>
        <InputGroupAddon>
          <Search />
        </InputGroupAddon>
        <InputGroupInput
          placeholder={t("guide.dialog.guide.placeholder")}
          onChange={(e) => setSearch(e.target.value)}
          value={search}
          autoFocus
        />
        {isWaiting && (
          <InputGroupAddon align="inline-end">
            <Spinner />
          </InputGroupAddon>
        )}
      </InputGroup>

      <div className="max-h-72 space-y-2 overflow-y-auto pr-2 [scrollbar-gutter:stable]">
        {!search.trim() && (
          <p className="py-6 text-center text-sm text-muted-foreground">
            {t("guide.dialog.guide.empty")}
          </p>
        )}

        {showNoResult && (
          <p className="py-6 text-center text-sm text-muted-foreground">
            {t("guide.dialog.guide.noResult", { search: search.trim() })}
          </p>
        )}

        {!isWaiting &&
          users.map((user) => (
            <div
              key={user.sciper}
              className="flex items-center gap-3 rounded-lg border p-3 text-sm transition-colors hover:bg-muted/50"
            >
              <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground">
                <UserRound className="size-4" />
              </div>
              <div className="flex min-w-0 flex-1 flex-col">
                <span className="truncate font-medium">
                  {user.firstName} {user.lastName}
                </span>
                <span className="text-xs text-muted-foreground">
                  {user.sciper}
                </span>
              </div>
              <Button size="sm" onClick={() => onSelect(user)}>
                {t("actions.select")}
                <ArrowRight data-icon="inline-end" />
              </Button>
            </div>
          ))}
      </div>
    </div>
  )
}

export const SelectLanguage = ({
  setStep,
  selectedInformation,
  setSelectedInformation,
}: {
  setStep: (step: number) => void
  selectedInformation: CreateGuide
  setSelectedInformation: Dispatch<SetStateAction<CreateGuide>>
}) => {
  const { t } = useTranslation()
  const selectedLanguages = selectedInformation.languageIds
  const [isWaiting, setIsWaiting] = useState<boolean>(true)
  const [languages, setLanguages] = useState<Language[]>([])

  async function getLanguages() {
    try {
      const languagesResponse = await getAvailableLanguages()
      if (!languagesResponse.success) {
        if (languagesResponse.code === 401) {
          setLanguages([])
          return
        }
        throw new Error(languagesResponse.error)
      }
      setLanguages(languagesResponse.data)
    } catch {
      toast.error(t("errors.dataloading.defaultMessage"))
      setLanguages([])
    } finally {
      setIsWaiting(false)
    }
  }

  useEffect(() => {
    getLanguages()
  }, [])

  function toggleLanguage(id: number, checked: boolean) {
    setSelectedInformation((prev) => ({
      ...prev,
      languageIds: checked
        ? [...prev.languageIds, id]
        : prev.languageIds.filter((languageId) => languageId !== id),
    }))
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="grid grid-cols-2 gap-3">
        {isWaiting ? (
          Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))
        ) : languages.length === 0 ? (
          <p className="col-span-2 py-6 text-center text-sm text-muted-foreground">
            {t("guide.dialog.language.empty")}
          </p>
        ) : (
          languages.map((language) => (
            <Label
              key={language.id}
              className="cursor-pointer rounded-lg border p-3 transition-colors hover:bg-muted/50 has-data-checked:border-primary has-data-checked:bg-primary/5"
            >
              <Checkbox
                checked={selectedLanguages.includes(language.id)}
                onCheckedChange={(checked) =>
                  toggleLanguage(language.id, checked)
                }
              />
              {language.name}
              <span className="ml-auto rounded bg-muted px-1.5 py-0.5 text-xs text-muted-foreground uppercase">
                {language.code}
              </span>
            </Label>
          ))
        )}
      </div>

      <p className="text-xs text-muted-foreground">
        {selectedLanguages.length === 0
          ? t("guide.dialog.language.none")
          : t("guide.dialog.language.selected", {
              count: selectedLanguages.length,
            })}
      </p>

      <DialogFooter className="sm:justify-between">
        <Button variant="outline" onClick={() => setStep(1)}>
          <ArrowLeft data-icon="inline-start" />
          {t("actions.previous")}
        </Button>
        <Button
          disabled={selectedLanguages.length === 0}
          onClick={() => setStep(3)}
        >
          {t("actions.next")}
          <ArrowRight data-icon="inline-end" />
        </Button>
      </DialogFooter>
    </div>
  )
}
export const SelectPlace = ({
  setStep,
  selectedInformation,
  setSelectedInformation,
}: {
  setStep: (step: number) => void
  selectedInformation: CreateGuide
  setSelectedInformation: Dispatch<SetStateAction<CreateGuide>>
}) => {
  const { t, i18n } = useTranslation()
  const selectedPlaces = selectedInformation.placeIds
  const [isWaiting, setIsWaiting] = useState<boolean>(true)
  const [places, setPlaces] = useState<Place[]>([])
  const currentLanguage = (i18n.resolvedLanguage || "en") as "en" | "fr"

  const allSelected =
    places.length > 0 && selectedPlaces.length === places.length

  async function getPlaces() {
    try {
      const placesResponse = await getAvailablePlaces()
      if (!placesResponse.success) {
        if (placesResponse.code === 401) {
          setPlaces([])
          return
        }
        throw new Error(placesResponse.error)
      }
      setPlaces(placesResponse.data)
    } catch {
      toast.error(t("errors.dataloading.defaultMessage"))
      setPlaces([])
    } finally {
      setIsWaiting(false)
    }
  }

  useEffect(() => {
    getPlaces()
  }, [])

  function togglePlace(id: number, checked: boolean) {
    setSelectedInformation((prev) => ({
      ...prev,
      placeIds: checked
        ? [...prev.placeIds, id]
        : prev.placeIds.filter((placeId) => placeId !== id),
    }))
  }

  function toggleAll() {
    setSelectedInformation((prev) => ({
      ...prev,
      placeIds: allSelected ? [] : places.map((place) => place.id),
    }))
  }

  return (
    <div className="flex flex-col gap-3">
      {places.length > 1 && (
        <div className="flex justify-end">
          <Button variant="ghost" size="sm" onClick={toggleAll}>
            {allSelected
              ? t("guide.dialog.place.deselectAll")
              : t("guide.dialog.place.selectAll")}
          </Button>
        </div>
      )}

      <div className="flex max-h-80 flex-col gap-2 overflow-y-auto pr-2 [scrollbar-gutter:stable]">
        {isWaiting ? (
          Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))
        ) : places.length === 0 ? (
          <p className="py-6 text-center text-sm text-muted-foreground">
            {t("guide.dialog.place.empty")}
          </p>
        ) : (
          places.map((place) => (
            <Label
              key={place.id}
              className="cursor-pointer gap-3 rounded-lg border p-2 pr-3 transition-colors hover:bg-muted/50 has-data-checked:border-primary has-data-checked:bg-primary/5"
            >
              {place.picture ? (
                <img
                  src={place.picture}
                  alt=""
                  className="size-12 shrink-0 rounded-md object-cover"
                />
              ) : (
                <div className="flex size-12 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground">
                  <MapPin className="size-5" />
                </div>
              )}
              <div className="flex min-w-0 flex-1 flex-col gap-1">
                <span className="truncate">{place.title[currentLanguage]}</span>
                <span className="flex items-center gap-1 text-xs font-normal text-muted-foreground">
                  <Users className="size-3" />
                  {t("guide.dialog.place.capacity", { count: place.capacity })}
                </span>
              </div>
              <Checkbox
                checked={selectedPlaces.includes(place.id)}
                onCheckedChange={(checked) => togglePlace(place.id, checked)}
              />
            </Label>
          ))
        )}
      </div>

      <p className="text-xs text-muted-foreground">
        {selectedPlaces.length === 0
          ? t("guide.dialog.place.none")
          : t("guide.dialog.place.selected", {
              count: selectedPlaces.length,
            })}
      </p>

      <DialogFooter className="sm:justify-between">
        <Button variant="outline" onClick={() => setStep(2)}>
          <ArrowLeft data-icon="inline-start" />
          {t("actions.previous")}
        </Button>
        <Button
          disabled={selectedPlaces.length === 0}
          onClick={() => setStep(4)}
        >
          {t("actions.next")}
          <ArrowRight data-icon="inline-end" />
        </Button>
      </DialogFooter>
    </div>
  )
}

export const AddGuideDialog = () => {
  const { t } = useTranslation()
  const [step, setStep] = useState<number>(1)
  const [selectedGuide, setSelectedGuide] = useState<ResponseUserAPI | null>(
    null
  )
  const [selectedInformation, setSelectedInformation] =
    useState<CreateGuide>(EMPTY_INFORMATION)

  const current = STEPS[step - 1]
  const StepIcon = current.icon

  function handleOpenChange(open: boolean) {
    if (open) return
    setStep(1)
    setSelectedGuide(null)
    setSelectedInformation(EMPTY_INFORMATION)
  }

  function handleGuideSelect(user: ResponseUserAPI) {
    setSelectedGuide(user)
    setSelectedInformation((prev) => ({ ...prev, sciper: Number(user.sciper) }))
    setStep(2)
  }

  return (
    <Dialog onOpenChange={handleOpenChange}>
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
          <Stepper value={step} numberOfSteps={STEPS.length} />
          <div className="flex items-start gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <StepIcon className="size-5" />
            </div>
            <div className="flex flex-col gap-1.5">
              <span className="text-xs text-muted-foreground">
                {t("guide.dialog.step", {
                  current: step,
                  total: STEPS.length,
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
                />
              )
            case 3:
              return (
                <SelectPlace
                  setStep={setStep}
                  selectedInformation={selectedInformation}
                  setSelectedInformation={setSelectedInformation}
                />
              )
            default:
              return (
                <DialogFooter className="sm:justify-start">
                  <Button variant="outline" onClick={() => setStep(step - 1)}>
                    <ArrowLeft data-icon="inline-start" />
                    {t("actions.previous")}
                  </Button>
                </DialogFooter>
              )
          }
        })()}
      </DialogContent>
    </Dialog>
  )
}
