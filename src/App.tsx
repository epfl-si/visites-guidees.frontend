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
import { RequireRole } from './auth/RequireRole';
import NotFound from "@/pages/not-found"

export default function App() {
  const oidc = useOpenIDConnectContext();
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
      if (response.success) {
        setConnectedUser(response.data)
      }

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
