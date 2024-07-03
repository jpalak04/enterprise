import { Knex } from 'knex';
import { Config } from '@backstage/config';

/**
 * Generates the database name based on a configuration and a plugin identifier.
 * @param {Config} config - The Backstage configuration object.
 * @param {string} pluginId - The identifier for the plugin.
 * @return {string} The constructed database name.
 */
export function getDatabaseName(config: Config, pluginId: string): string {
    const prefix = config.getOptionalString('backend.database.prefix') || 'backstage_plugin';
    return `${prefix}_${pluginId}`;
}

/**
 * Initializes the database if it does not exist.
 * @param {Knex} knex - The Knex connection instance.
 * @param {Config} config - The Backstage configuration object.
 * @param {string} pluginId - The identifier for the plugin.
 */
export async function initializeDatabase(knex: Knex, config: Config, pluginId: string): Promise<void> {
    const dbName = getDatabaseName(config, pluginId);
    const hasDb = await knex.raw(`SELECT 1 FROM pg_database WHERE datname='${dbName}'`);
    if (hasDb.rows.length === 0) {
        await knex.raw(`CREATE DATABASE "${dbName}"`);
    }
}

/**
 * Applies the latest database migrations from the specified directory.
 * @param {Knex} knex - The Knex connection instance.
 * @param {string} migrationsDir - The directory containing migration files.
 */
export async function applyDatabaseMigrations(knex: Knex, migrationsDir: string): Promise<void> {
    console.log(`Hello- Applying migrations from ${migrationsDir} `);
    await knex.migrate.latest({
        directory: migrationsDir
    });
}
export async function seedDatabase(knex: Knex, seedDir: string): Promise<void> {
    console.log(`Hello- Applying seed file from ${seedDir} `);
    await knex.seed.run({
        directory: seedDir
    });
}
