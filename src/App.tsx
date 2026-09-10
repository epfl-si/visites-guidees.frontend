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
import { setGlobalAccessToken } from '@/lib/api';
import Reservations from './pages/reservations';
import Reservation from './pages/reservation';
import { RequireRole } from './auth/RequireRole';
import NotFound from "@/pages/not-found"
import { registrationSegments } from '@/lib/routes';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import Guides from '@/pages/guides';

export default function App() {
  const oidc = useOpenIDConnectContext();
  const { t } = useTranslation();
  const [connectedUser, setConnectedUser] = useState<UserType>({
    firstName: '',
    lastName: '',
    roles: [],
    username: "",
    email:""
  });

  useEffect(() => {
    if (oidc.state === StateEnum.LoggedIn && oidc.accessToken) {
      setGlobalAccessToken(oidc.accessToken);
      loadFetch();

    } else if (oidc.state !== StateEnum.LoggedIn) {
      setGlobalAccessToken(null);
    }
  }, [oidc.accessToken, oidc.state]);

  const loadFetch = async () => {
    try {
      const response = await fetchConnectedUser()
      if (!response.success) {
        console.error('ConnectedUser Error', response.error)
        toast.error(t('errors.dataLoading.userDataError'))
        return
      }
      setConnectedUser(response.data)

    } catch (error) {
      console.log('ConnectedUser Error', error);
      oidc.logout();
    }
  };

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route element={<AppLayout user={connectedUser} oidc={oidc} />}>
            <Route path='*' element={<NotFound/>}/>
            <Route path="/" element={<Page />} />
            {registrationSegments.map((segment) => (
              <Route
                key={segment}
                path={`/:placeId/${segment}`}
                element={<Registration user={connectedUser} oidc={oidc} />}
              />
            ))}
            <Route element={<RequireRole role="admin" user={connectedUser} />}>
              <Route element={<AdminLayout />}>
                {/* All routes that here require admin permission */}
                <Route path="/admin" element={<Admin />} />
                <Route path="/admin/reservation" element={<Reservations />} />
                <Route path="/admin/reservation/:id" element={<Reservation />} />
                <Route path="/admin/guide" element={<Guides />} />
              </Route>
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}
