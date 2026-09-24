import {
  ArrowLeft,
  ArrowRight,
  CircleCheck,
  CirclePlus,
  Languages,
  MapPin,
  Search,
  UserRound,
  UserSearch,
} from "lucide-react"
import { useEffect, useState, useCallback } from "react"
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

import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group"
import { useTranslation } from "react-i18next"
import { toast } from "sonner"
import Stepper from "../stepper"

const STEPS = [
  { key: "guide", icon: UserSearch },
  { key: "language", icon: Languages },
  { key: "place", icon: MapPin },
  { key: "confirm", icon: CircleCheck },
] as const

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

  async function handleGuideClick(sciper: number) {
    try {
      const response = await addGuide(sciper)
      if (!response.success) {
        if (response.code === 401) return
        throw new Error(response.error)
      }
      toast.success(t("guide.addSuccess"))
    } catch {
      toast.error(t("guide.addError"))
    }
  }

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

      <div className="max-h-72 space-y-2 overflow-y-auto">
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

export const AddGuideDialog = () => {
  const { t } = useTranslation()
  const [step, setStep] = useState<number>(1)
  const [selectedGuide, setSelectedGuide] = useState<ResponseUserAPI | null>(
    null
  )

  const current = STEPS[step - 1]
  const StepIcon = current.icon

  function handleOpenChange(open: boolean) {
    if (open) return
    setStep(1)
    setSelectedGuide(null)
  }

  function handleGuideSelect(user: ResponseUserAPI) {
    setSelectedGuide(user)
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
