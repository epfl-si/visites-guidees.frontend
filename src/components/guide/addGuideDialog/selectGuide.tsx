import { ArrowRight, Search, UserRound } from "lucide-react"
import { useEffect, useEffectEvent, useState } from "react"
import { useTranslation } from "react-i18next"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group"
import { Spinner } from "@/components/ui/spinner"
import { searchUser } from "@/services/user"
import type { ResponseUserAPI } from "@/types/user"

export const SelectGuide = ({
  onSelect,
}: {
  onSelect: (user: ResponseUserAPI) => void
}) => {
  const { t } = useTranslation()

  const [isWaiting, setIsWaiting] = useState<boolean>(false)
  const [hasSearched, setHasSearched] = useState<boolean>(false)
  const [users, setUsers] = useState<ResponseUserAPI[]>([])
  const [search, setSearch] = useState<string>("")

  const handleSearch = useEffectEvent(async (query: string) => {
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
  })

  useEffect(() => {
    const timeout = setTimeout(() => {
      handleSearch(search)
    }, 300)

    return () => clearTimeout(timeout)
  }, [search])

  const handleSetSearch = (value: string) => {
    setSearch(value)
    setHasSearched(false)

    if (!value) setUsers([])
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
          onChange={(e) => handleSetSearch(e.target.value)}
          value={search}
          autoFocus
        />
        {isWaiting && (
          <InputGroupAddon align="inline-end">
            <Spinner />
          </InputGroupAddon>
        )}
      </InputGroup>

      <div className="max-h-72 scrollbar-gutter-stable space-y-2 overflow-y-auto pr-2">
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
