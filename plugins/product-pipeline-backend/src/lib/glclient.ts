import { CacheService } from '@backstage/backend-plugin-api';
import fetch from 'node-fetch';
import { Logger } from 'winston';
import { createHash } from 'crypto';

export  class GitLabClient {
    private readonly apiBaseUrl: string;
    private readonly token: string;
    private readonly logger: Logger;

    constructor(apiBaseUrl: string, token: string, logger: Logger) {
        this.apiBaseUrl = apiBaseUrl;
        this.token = token;
        this.logger = logger;
    }

    async fetchFileContent(projectId: string, filePath: string, branch: string, cache: CacheService): Promise<{ content: string, fromCache: boolean }> {
        projectId = encodeURIComponent(projectId).replace(new RegExp('/', 'g'), '%2F');
        filePath = encodeURIComponent(filePath).replace(new RegExp('/', 'g'), '%2F');
        const cacheKey = `${projectId}/${filePath}/${branch}`;
        const cached = await cache.get(cacheKey);
        const url = `${this.apiBaseUrl}/projects/${projectId}/repository/files/${filePath}/raw?ref=${branch}`;


        const headers = {
            'PRIVATE-TOKEN': this.token
        };
        this.logger.info(`Fetching file from GitLab: ${url}`); // Debugging
    
        const response = await fetch(url, { headers });
        if (!response.ok) {
            this.logger.error(`Failed to fetch file: HTTP status ${response.status}`);
            return { content: '', fromCache: false };
        }
        const content = await response.text();
        const hash = this.hashContent(content);
        if (cached !== hash) {
            await cache.set(cacheKey, hash);
        } else {    
            this.logger.info(`File content not changed: ${url}`);
            return {content, fromCache: true};

        }
        return {content, fromCache: false};
    }  
    
    private hashContent(content: string): string {
        return createHash('sha256').update(content).digest('hex');
    }

    async fetchProjectPipelines(projectId: string): Promise<any> {
        const url = `${this.apiBaseUrl}/projects/${projectId}/pipelines`;

        const headers = {
            'PRIVATE-TOKEN': this.token
        };
        this.logger.info(`Fetching pipelines from GitLab: ${url}`); // Debugging

        const response = await fetch(url, { headers });
        if (!response.ok) {
            this.logger.error(`Failed to fetch pipelines: HTTP status ${response.status}`);
            throw new Error(`Failed to fetch pipelines: HTTP status ${response.status}`);
        }
        const pipelines = await response.json();
        return pipelines;
    }
}