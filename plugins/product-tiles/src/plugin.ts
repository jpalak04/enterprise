import { createPlugin, createRoutableExtension } from '@backstage/core-plugin-api';

import { rootRouteRef } from './routes';

export const productTilesPlugin = createPlugin({
  id: 'product-tiles',
  routes: {
    root: rootRouteRef,
  },
});

export const ProductTilesPage = productTilesPlugin.provide(
  createRoutableExtension({
    name: 'ProductTilesPage',
    component: () =>
      import('./components/ProductTiles').then(m => m.ProductCard),
    mountPoint: rootRouteRef,
  }),
);
