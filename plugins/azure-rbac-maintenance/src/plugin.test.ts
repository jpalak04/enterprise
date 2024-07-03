import { azureRbacMaintenancePlugin } from './plugin';

describe('azure-rbac-maintenance', () => {
  it('should export plugin', () => {
    expect(azureRbacMaintenancePlugin).toBeDefined();
  });
});
