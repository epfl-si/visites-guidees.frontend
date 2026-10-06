import Guides from "@/pages/guides"
import { RequireAuth } from "./auth/RequireAuth"
import ErrorPage from "./pages/Error"
import { useEffect, useState } from 'react'
import { StateEnum, useOpenIDConnectContext } from "@epfl-si/react-appauth";
import { AppLayout } from "@/components/layout/AppLayout";
import AdminLayout from './components/layout/AdminLayout';
import { BrowserRouter, Route, Routes } from "react-router";
import type { UserType } from "@/types/user";
import Page from "@/pages/Page.tsx";
import { fetchConnectedUser } from '@/services/auth';
import Registration from '@/pages/registration';
import Admin from '@/pages/admin';
import { setGlobalAccessToken, setUnauthorizedHandler } from '@/lib/api';
import Reservations from './pages/reservations';
import Reservation from './pages/reservation';
import { RequireRole } from './auth/RequireRole';
import { registrationSegments } from '@/lib/routes';
import GuideConfirmation from '@/pages/guide-confirmation';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

export default function App() {
  const oidc = useOpenIDConnectContext()
  const { t } = useTranslation()
  const [connectedUser, setConnectedUser] = useState<UserType>({
    firstName: "",
    lastName: "",
    roles: [],
    username: "",
    email: "",
  })
  const connectedUserLoading =
    oidc.state === StateEnum.InProgress ||
    (oidc.state === StateEnum.LoggedIn && !connectedUser.username)

  useEffect(() => {
    setUnauthorizedHandler(() => {
      toast.error(t("errors.session.expired"), {
        action: {
          label: t("errors.session.reconnect"),
          onClick: () => window.location.reload(),
        },
      })
    })
    return () => setUnauthorizedHandler(null)
  }, [t])

  useEffect(() => {
    if (oidc.state === StateEnum.LoggedIn && oidc.accessToken) {
      setGlobalAccessToken(oidc.accessToken)

      let ignore = false

      fetchConnectedUser()
        .then((response) => {
          if (ignore) return
          if (!response.success) {
            if (response.code !== 401) {
              toast.error(t("errors.dataLoading.userDataError"))
            }
            return
          }
          setConnectedUser(response.data)
        })
        .catch(() => {
          if (ignore) return
          oidc.logout()
        })

      return () => {
        ignore = true
      }
    } else if (oidc.state !== StateEnum.LoggedIn) {
      setGlobalAccessToken(null)
    }
  }, [oidc, oidc.accessToken, oidc.state, t])
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route element={<AppLayout user={connectedUser} oidc={oidc} />}>
            <Route
              path="*"
              element={
                <ErrorPage
                  errorCode={404}
                  message="errors.notFound.generic.title"
                />
              }
            />
            {"errors.generic"}
            <Route path="/" element={<Page />} />
            {registrationSegments.map((segment) => (
              <Route
                key={segment}
                path={`/:placeId/${segment}`}
                element={<Registration />}
              />
            ))}
            <Route path="/admin" element={<RequireAuth oidc={oidc} />}>
              <Route
                element={
                  <RequireRole
                    role="admin"
                    user={connectedUser}
                    loading={connectedUserLoading}
                  />
                }
              >
                <Route element={<AdminLayout />}>
                  <Route index element={<Admin />} />
                  <Route path="reservations" >
                    <Route index element={<Reservations />}/>
                    <Route path=":id" element={<Reservation />} />
                  </Route>
                  <Route path="guides" element={<Guides />} />
                </Route>
              </Route>
              <Route
                element={
                  <RequireRole
                    role="guide"
                    user={connectedUser}
                    loading={connectedUserLoading}
                  />
                }
              >
                <Route
                  path="guide/reservations/:reservationId"
                  element={<GuideConfirmation />}
                />
              </Route>
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  )
}
