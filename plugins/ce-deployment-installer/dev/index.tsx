import React from 'react';
import { createDevApp } from '@backstage/dev-utils';
import { ceDeploymentInstallerPlugin, CeDeploymentInstallerPage } from '../src/plugin';

createDevApp()
  .registerPlugin(ceDeploymentInstallerPlugin)
  .addPage({
    element: <CeDeploymentInstallerPage />,
    title: 'Root Page',
    path: '/ce-deployment-installer'
  })
  .render();
