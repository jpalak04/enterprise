import { ceDeploymentInstallerPlugin } from './plugin';

describe('ce-deployment-installer', () => {
  it('should export plugin', () => {
    expect(ceDeploymentInstallerPlugin).toBeDefined();
  });
});
