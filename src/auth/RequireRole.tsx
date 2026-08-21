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
  // require to be authenticated
  if (role == "") {
    return <Navigate to="/" replace />
  }

  if (!user.username) {
    return <LoadingPage />
  }

  if (!user.roles.includes(role)) {
    return <Navigate to="/" replace />
  }

  return <Outlet />
}
