import React from 'react';
import { createDevApp } from '@backstage/dev-utils';
import { azureRbacMaintenancePlugin, AzureRbacMaintenancePage } from '../src/plugin';

createDevApp()
  .registerPlugin(azureRbacMaintenancePlugin)
  .addPage({
    element: <AzureRbacMaintenancePage />,
    title: 'Root Page',
    path: '/azure-rbac-maintenance',
  })
  .render();
