import { createPlugin, createRoutableExtension } from '@backstage/core-plugin-api';

import { rootRouteRef } from './routes';

export const axwayGrafanaPlugin = createPlugin({
  id: 'axway-grafana-plugin',
  routes: {
    root: rootRouteRef,
  },
});

export const AxwayGrafanaPluginPage = axwayGrafanaPlugin.provide(
  createRoutableExtension({
    name: 'AxwayGrafanaPluginPage',
    component: () =>
      import('./components/DashboardComponent').then(m => m.DashboardComponent),
    mountPoint: rootRouteRef,
  }),
);
