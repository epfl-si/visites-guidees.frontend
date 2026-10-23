import { createRoot } from 'react-dom/client'
import '@/index.css'
import App from '@/app'
import { LocalStorageBackend, OIDCContext } from "@epfl-si/react-appauth";
import { env } from './lib/env';
import '@/lib/i18n';

const store = new LocalStorageBackend();
createRoot(document.getElementById('root')!).render(
  <OIDCContext
    authServerUrl={env().VG_ENTRA_URL}
    client={{
      clientId: env().VG_ENTRA_CLIENT_ID,
      scope: env().VG_ENTRA_SCOPE,
      redirectUri: env()[window.location.hostname.includes('guided-tours') ? "VG_HOMEPAGE_EN" : "VG_HOMEPAGE_FR"]
    }}
    storage={store}
    refreshStorage={window.localStorage}
    onLogout={() => window.location.href=env().VG_HOMEPAGE ?? ''}
  >
    <App />
  </OIDCContext>
)
