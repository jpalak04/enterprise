import React from 'react';
import { createDevApp } from '@backstage/dev-utils';
import { productCicdViewerPlugin, ProductCicdViewerPage } from '../src/plugin';

createDevApp()
  .registerPlugin(productCicdViewerPlugin)
  .addPage({
    element: <ProductCicdViewerPage />,
    title: 'Root Page',
    path: '/product-cicd-viewer',
  })
  .render();
