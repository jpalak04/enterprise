// plugins/rbac-azure-backend/src/config/azureAdConfig.ts
import { Config } from '@backstage/config';

export function getMsalConfig(config: Config) {
  return {
    auth: {
      clientId: config.getString('auth.providers.microsoft.development.clientId'),
      authority: `https://login.microsoftonline.com/${config.getString('auth.providers.microsoft.development.tenantId')}`,
      clientSecret: config.getString('auth.providers.microsoft.development.clientSecret'),
    },
  };
}

export const tokenRequest = {
  scopes: ["https://graph.microsoft.com/.default"],
};
