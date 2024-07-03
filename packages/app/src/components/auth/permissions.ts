
import { createPermission } from '@backstage/plugin-permission-common';

export const viewDashboardPermission = createPermission({
  name: 'view.dashboard',
  attributes: { action: 'read' },
});

export enum AppPermission {
    DO_THIS = 'app.permission.doThis',
    // ... other permissions
}
