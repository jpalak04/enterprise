import { createPlugin, createRoutableExtension } from '@backstage/core-plugin-api';

import { rootRouteRef } from './routes';

export const ceDeploymentInstallerPlugin = createPlugin({
  id: 'ce-deployment-installer',
  routes: {
    root: rootRouteRef,
  },
});

export const CeDeploymentInstallerPage = ceDeploymentInstallerPlugin.provide(
  createRoutableExtension({
    name: 'CeDeploymentInstallerPage',
    component: () =>
      import('./components/DeploymentComponent').then(m => m.DeploymentComponent),
    mountPoint: rootRouteRef,
  }),
);
