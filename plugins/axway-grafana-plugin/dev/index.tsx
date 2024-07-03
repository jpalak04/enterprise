import React from 'react';
import { createDevApp } from '@backstage/dev-utils';
import { axwayGrafanaPlugin, AxwayGrafanaPluginPage } from '../src/plugin';

createDevApp()
  .registerPlugin(axwayGrafanaPlugin)
  .addPage({
    element: <AxwayGrafanaPluginPage />,
    title: 'Root Page',
    path: '/axway-grafana-plugin'
  })
  .render();
