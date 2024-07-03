import {
  createPlugin,
  createRoutableExtension,
} from '@backstage/core-plugin-api';

import { rootRouteRef } from './routes';

export const productCicdViewerPlugin = createPlugin({
  id: 'product-cicd-viewer',
  routes: {
    root: rootRouteRef,
  },
});

export const ProductCicdViewerPage = productCicdViewerPlugin.provide(
  createRoutableExtension({
    name: 'ProductCicdViewerPage',
    component: () =>
      import('./components/ProductLandingPage').then(m => m.ExampleComponent),
    mountPoint: rootRouteRef,
  }),
);
