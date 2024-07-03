import { Logger } from "winston";
import { Config } from "@backstage/config";
import {
    ScmIntegrations
} from '@backstage/integration';
import { readTilesConfig } from "./config";
import { GitLabClient } from "./glclient";
import { CacheService, DatabaseService } from "@backstage/backend-plugin-api";
import { validateAndProcessYAML, processProductTiles } from "./validator";
import { ConfigService } from "./dbService";
import { Knex } from 'knex';
import { resolvePackagePath } from "@backstage/backend-common";

const schemaPath=resolvePackagePath('@internal/backstage-plugin-db-config-backend', "schema/config.json")
const schema = require(schemaPath); // Load the generated schema

// tasks.ts
export async function tilesDiscoveryTaskFunction(logger: Logger, config: Config, db: DatabaseService, cache: CacheService) {

    const url = 'https://git.ecd.axway.org'; // This URL should match the 'host' in your integration config

    // Assuming 'integrations' is already an instance of
    const integrations = ScmIntegrations.fromConfig(config);

    const integration = integrations.gitlab.byUrl(url);

    if (integration) {
        logger.info('GitLab integration found:', integration);
    } else {
        logger.error('No matching GitLab integration configuration found.');
        return;
    }
    logger.info("Running myTaskFunction...");
    const tcfg = readTilesConfig(config);
    const client = new GitLabClient(
        integration.config.apiBaseUrl || '',
        integration.config.token || '',
        logger
    );

    const conn: Knex = await db.getClient();

    const cfgServer = new ConfigService(conn, logger);
    tcfg.contexts.forEach(context => {
        // Want new client implementation to fetch the data from context.url, using the gitlab integration 
        logger.info(`Context: ${context.id}, Value: ${context.url}`)
        const parsedUrl = parseUrl(context.url);
        const { projectId, branch, filePath } = parsedUrl;
        client.fetchFileContent(projectId, filePath, branch, cache).then(content => {
            if (content.fromCache) {
                logger.debug(`File content not changed: ${filePath} in project ${projectId} (branch ${branch})`);
                return;
            }
            if (content.content !== '') {
                logger.debug(`Content (first 20 chars) of file ${filePath} in project ${projectId} (branch ${branch}): ${content.content.substring(0, 20)}`);
                try{ 
                    validateAndProcessYAML(content.content, context.id,  schema, processProductTiles, cfgServer );
                } catch (error) {   
                    logger.error(`Error validating and processing YAML: ${error}`);
                }
            }
        });


    });
}
function parseUrl(urlString: string): {
    projectId: string;
    filePath: string;
    branch: string;
} {
    const url = new URL(urlString);
    const path = url.pathname.split('/');

    // Typical path: /group/project/-/blob/branch/path/to/file
    const blobIndex = path.indexOf('blob');
    if (blobIndex === -1 || path.length <= blobIndex + 2) {
        throw new Error(`Failed to parse URL: ${urlString}`);
    }

    let projectId = path.slice(1, blobIndex).join('/');
    // Remove any unwanted trailing dash followed by "/"
    projectId = projectId.replace(/\/-$/, '');
    const filePath = path.slice(blobIndex + 2).join('/');
    const branch = path[blobIndex + 1];

    return {
        projectId,
        filePath,
        branch
    };
}
