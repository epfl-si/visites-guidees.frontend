import { Outlet } from "react-router"
import type { UserType } from "@/types/user"
import NotFound from "@/pages/not-found"

export const RequireRole = ({
  user,
  role,
}: {
  user: UserType
  role: string
}) => {

  if (!user.roles.includes(role)) {
    return <NotFound/>
  }

  return <Outlet />
}
