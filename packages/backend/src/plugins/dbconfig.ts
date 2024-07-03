import express from 'express';
import { PluginEnvironment } from '../types';
import { Knex } from 'knex';
import { resolvePackagePath } from '@backstage/backend-common'; // Assume this import for resolvePackagePath
import { applyDatabaseMigrations, seedDatabase } from '../utils/databaseUtils';
import { createRouter, readTilesConfig, tilesDiscoveryTaskFunction } from '@internal/backstage-plugin-db-config-backend';
import { HumanDuration, PluginTaskScheduler} from '@backstage/backend-tasks';
  


export default async function createPlugin(env: PluginEnvironment): Promise<express.Router> {
    const db: Knex = await env.database.getClient();


    // Initialize and prepare the database
    // await initializeDatabase(db, env.config, 'db-config-backend');
    const migrationsDir = resolvePackagePath('@internal/backstage-plugin-db-config-backend', 'db/migrations');
    const seedDir = resolvePackagePath('@internal/backstage-plugin-db-config-backend', 'db/seeds');
    await applyDatabaseMigrations(db, migrationsDir);
    await seedDatabase(db, seedDir);

    if (!env.scheduler) {
        throw new Error('Scheduler is not available in the plugin environment');
    }
    // Create and start a scheduled task
    const scheduler: PluginTaskScheduler = env.scheduler;

    const config= readTilesConfig(env.config);
    const scheduledTask = scheduler.createScheduledTaskRunner({
        frequency: config.schedule.frequency as HumanDuration,  // Task frequency
        timeout: config.schedule.timeout as HumanDuration,    // Task timeout
    });
    const tilesConfigTask = () => {
        tilesDiscoveryTaskFunction(env.logger, env.config, env.database, env.cache.getClient());   
     };

    scheduledTask.run({id: 'tiles-config-task', fn: tilesConfigTask});    
    
    // Create the router
    // Define routes and other middleware
    return await createRouter({
        logger: env.logger,
        db: env.database
    });
}
