import { Outlet } from "react-router"
import type { UserType } from "@/types/user"
import ErrorPage from "@/pages/Error"
import { LoadingPage } from "@/pages/Loading"

export const RequireRole = ({
  user,
  role,
  loading,
}: {
  user: UserType
  role: string
  loading: boolean
}) => {
  if (loading) {
    return <LoadingPage />
  }

  if (!user.roles.includes(role)) {
    return <ErrorPage errorCode={403} message="errors.forbidden.title" />
  }

  return <Outlet />
}
