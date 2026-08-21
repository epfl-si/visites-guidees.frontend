import { Navigate, Outlet } from "react-router"
import type { UserType } from "@/types/user"
import { LoadingPage } from "@/pages/Loading"

export const RequireRole = ({
  user,
  role,
}: {
  user: UserType
  role: string
}) => {

  if (!user.username) {
    return <LoadingPage />
  }

  if (!user.roles.includes(role)) {
    return <Navigate to="/" replace />
  }

  return <Outlet />
}
