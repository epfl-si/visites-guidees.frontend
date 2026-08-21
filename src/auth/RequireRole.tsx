import { Outlet } from "react-router"
import type { UserType } from "@/types/user"
import ErrorPage from "@/pages/Error"

export const RequireRole = ({
  user,
  role,
}: {
  user: UserType
  role: string
}) => {

  if (!user.roles.includes(role)) {
    return <ErrorPage errorCode={403} message="errors.forbidden.title"/>
  }

  return <Outlet />
}
