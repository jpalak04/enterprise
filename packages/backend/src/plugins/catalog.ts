import { CatalogBuilder } from '@backstage/plugin-catalog-backend';
import { ScaffolderEntitiesProcessor } from '@backstage/plugin-scaffolder-backend';
import { GitlabDiscoveryEntityProvider } from '@backstage/plugin-catalog-backend-module-gitlab'; 
import { Router } from 'express';
import { PluginEnvironment } from '../types';

export default async function createPlugin(
  env: PluginEnvironment,
): Promise<Router> {
  const builder = await CatalogBuilder.create(env);
  builder.addProcessor(new ScaffolderEntitiesProcessor());
    // Add GitLab Discovery Entity Provider
    builder.addEntityProvider(
      GitlabDiscoveryEntityProvider.fromConfig(env.config, {
        logger: env.logger,
        // Alternatively, you can define the schedule in the app-config.yaml and remove the above schedule option.
        scheduler: env.scheduler,
      }), 
    );
  const { processingEngine, router } = await builder.build();
  await processingEngine.start();
  return router;
}
