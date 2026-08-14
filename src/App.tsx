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
import { RequireAdmin } from '@/auth/RequireAdmin';
import { setGlobalAccessToken } from '@/lib/api';

export default function App() {
  const oidc = useOpenIDConnectContext();
  const [connectedUser, setConnectedUser] = useState<UserType>({
    firstName: '',
    lastName: '',
    groups: [],
    roles: [],
    username: "",
    isAdmin: false,
    isGuide: false,
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
      const data = await fetchConnectedUser();
      setConnectedUser({
        firstName: data.data.firstName,
        lastName: data.data.lastName,
        username: data.data.gaspar,
        roles: data.data.roles,
        isAdmin: data.data.isAdmin,
        isGuide: data.data.isGuide,
      });
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
            <Route path="/" element={<Page />} />
            <Route path="/:placeId/register" element={<Registration user={connectedUser} oidc={oidc} />} />
            <Route path="/:placeId/inscription" element={<Registration user={connectedUser} oidc={oidc} />} />
            <Route element={<RequireRole role="admin" user={connectedUser} />}>
              <Route element={<AdminLayout />}>
                {/* All routes that here require admin permission */}
                <Route path="/admin" element={<Admin />} />
              </Route>

            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}
