import { CirclePlus } from "lucide-react"
import { useEffect, useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button, buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { addGuide } from "@/services/guide"
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

export const AddGuideDialog = () => {
  const { t } = useTranslation()

  const [isWaiting, setIsWaiting] = useState<boolean>(false)
  const [hasSearched, setHasSearched] = useState<boolean>(false)
  const [users, setUsers] = useState<ResponseUserAPI[]>([])
  const [search, setSearch] = useState<string>("")

  async function handleSearch(query: string) {
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
    } catch (error) {
      console.error("searchUser Error", error)
      toast.error(t("guide.searchError"))
      setUsers([])
    } finally {
      setIsWaiting(false)
      setHasSearched(true)
    }
  }

  useEffect(() => {
    setHasSearched(false)

    if (!search) {
      setUsers([])
      return
    }

    const timeout = setTimeout(() => {
      handleSearch(search)
    }, 300)

    return () => clearTimeout(timeout)
  }, [search])

  async function handleGuideClick(sciper: number) {
    try {
      const response = await addGuide(sciper)
      if (!response.success) {
        if (response.code === 401) return
        throw new Error(response.error)
      }
      toast.success(t("guide.addSuccess"))
    } catch (error) {
      console.error("addGuide Error", error)
      toast.error(t("guide.addError"))
    }
  }

  const showNoResult =
    !isWaiting && hasSearched && users.length === 0 && search.trim() !== ""

  return (
    <Dialog>
      <DialogTrigger
        className={cn(buttonVariants(), "flex items-center gap-2 text-nowrap")}
      >
        {t("guide.add")}
        <CirclePlus />
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle> {t("guide.add")}</DialogTitle>
        </DialogHeader>
        <InputGroup className="">
          <InputGroupInput
            placeholder="Search..."
            onChange={(e) => setSearch(e.target.value)}
            value={search}
          />
          {isWaiting && (
            <InputGroupAddon align="inline-end">
              <Spinner />
            </InputGroupAddon>
          )}
        </InputGroup>

        <div className="mt-4 space-y-1">
          {isWaiting && (
            <p className="text-sm text-muted-foreground">
              {t("guide.searching")}
            </p>
          )}

          {showNoResult && (
            <p className="text-sm text-muted-foreground">
              {t("guide.noResult")}
            </p>
          )}

          {!isWaiting &&
            users.map((user) => (
              <div className="flex justify-between rounded-md border p-2 text-sm">
                <div key={user.sciper} className="flex items-center">
                  <span className="font-medium">
                    {user.firstName} {user.lastName}
                  </span>
                </div>
                <div className="flex">
                  <span className="m-1 text-muted-foreground">
                    {user.sciper}
                  </span>
                  <Button onClick={() => handleGuideClick(Number(user.sciper))}>
                    {t("actions.add")}
                  </Button>
                </div>
              </div>
            ))}
        </div>
      </DialogContent>
    </Dialog>
  )
}
