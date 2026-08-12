import { createRoot } from 'react-dom/client'
import '@/index.css'
import App from '@/App'
import { LocalStorageBackend, OIDCContext } from "@epfl-si/react-appauth";
import { env } from './lib/env';
import '@/lib/i18n';

const store = new LocalStorageBackend();
createRoot(document.getElementById('root')!).render(
  <OIDCContext
    authServerUrl={env().GUIDED_TOURS_ENTRA_SERVER_URL ?? ''}
    client={{
      clientId: env().GUIDED_TOURS_ENTRA_CLIENT_ID ?? '',
      scope: env().GUIDED_TOURS_ENTRA_SCOPE,
      redirectUri: env().GUIDED_TOURS_URL
    }}
    storage={store}
    refreshStorage={window.localStorage}
    onLogout={() => window.location.href=env().GUIDED_TOURS_URL ?? ''}
  >
    <App />
  </OIDCContext>
)
