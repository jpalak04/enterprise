import { microsoftAuthApiRef } from '@backstage/core-plugin-api';

export const providers = [
  {
    id: 'microsoft-auth-provider',
    title: 'Azure Active Directory',
    message: 'Sign in using Azure AD',
    apiRef: microsoftAuthApiRef,
  }
];