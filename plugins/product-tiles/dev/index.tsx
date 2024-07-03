import React from 'react';
import { createDevApp } from '@backstage/dev-utils';
import { productTilesPlugin, ProductTilesPage } from '../src/plugin';

createDevApp()
  .registerPlugin(productTilesPlugin)
  .addPage({
    element: <ProductTilesPage />,
    title: 'Root Page',
    path: '/product-tiles'
  })
  .render();
