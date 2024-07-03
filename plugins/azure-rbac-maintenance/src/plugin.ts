import {
  createPlugin,
  createRoutableExtension,
} from '@backstage/core-plugin-api';

import { rootRouteRef } from './routes';

export const azureRbacMaintenancePlugin = createPlugin({
  id: 'azure-rbac-maintenance',
  routes: {
    root: rootRouteRef,
  },
});

export const AzureRbacMaintenancePage = azureRbacMaintenancePlugin.provide(
  createRoutableExtension({
    name: 'AzureRbacMaintenancePage',
    component: () =>
      import('./components/RBAC Form').then(m => m.RBACMaintenanceCard),
    mountPoint: rootRouteRef,
  }),
);
