import { CirclePlus } from "lucide-react"
import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button, buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { addGuide, searchUser } from "@/services/guide"
import type { ResponseUserAPI } from "@/types/user"
import { Spinner } from "@/components/ui/spinner"

import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group"
import { useTranslation } from "react-i18next"

export const AddGuideDialog = () => {
  const { t } = useTranslation()

  const [isWaiting, setIsWaiting] = useState<boolean>(false)
  const [users, setUsers] = useState<ResponseUserAPI[]>([])
  const [search, setSearch] = useState<string>("")

  async function handleSearch() {
    if (search) {
      setIsWaiting(true)
      const usersResponse = await searchUser(search)
      if(usersResponse.success){
        setUsers(usersResponse.data)
        setIsWaiting(false)
      }
    }
  }

  async function handleGuideClick(sciper: number) {
    await addGuide(sciper)
  }
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
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSearch()
            }}
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

          {!isWaiting && users.length === 0 && search.trim() !== "" && (
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
