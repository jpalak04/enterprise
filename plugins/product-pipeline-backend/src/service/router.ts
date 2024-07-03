import { errorHandler } from '@backstage/backend-common';
import { Logger } from "winston";
import {
  ScmIntegrations
} from '@backstage/integration';
import { Config } from "@backstage/config";
import express from 'express';
import Router from 'express-promise-router';
import { PipelineData } from '../types';
import { GitLabClient } from '../lib/glclient';
import { formatDate, formatTimestamp } from '../lib/utils';

export interface RouterOptions {
  logger: Logger;
  config: Config;
}

const mockedData: PipelineData[] = [
  {
    id: 12345,
    status: "success",
    stage: "build",
    name: "build-job",
    ref: "main",
    tag: false,
    coverage: null,
    allow_failure: true,
    created_at: "2024-05-17T23:05:06.149Z",
    started_at: "2024-05-17T23:11:49.103Z",
    finished_at: "2024-05-17T23:12:51.109Z",
    duration: 62.006238,
    queued_duration: 262.173042,
    user: {
      id: 101,
      username: "johndoe",
      name: "John Doe",
      avatar_url: "https://example.com/avatar.jpg",
      web_url: "https://example.com/johndoe"
    },
    commit: {
      id: "495e586587f36566338ff0f94abcace03fbf54d0",
      short_id: "495e5865",
      title: "Merge branch 'feature' into 'main'",
      message: "Merge branch 'feature' into 'main'\n\nFix issue #123\n\nSee merge request!28",
      author_name: "John Doe",
      author_email: "johndoe@example.com",
      web_url: "https://example.com/commit/495e5865"
    },
    pipeline: {
      id: 885193,
      status: "success",
      source: "push",
      created_at: "2024-05-17T23:05:06.057Z",
      web_url: "https://example.com/pipelines/885193"
    },
    web_url: "https://example.com/jobs/12345",
    artifacts: [
      {
        file_type: "trace",
        size: 14287,
        filename: "job.log"
      }
    ],
    runner: {
      id: 2110,
      description: "runner-1",
      ip_address: "10.249.28.76",
      status: "online"
    },
    project: {
      name: "project-name",
      web_url: "https://example.com/project"
    },
    build_number: 574
  }
];

export function getGLClient(config: Config, logger: Logger): GitLabClient | null {
  const url = 'https://git.ecd.axway.org'; // This URL should match the 'host' in your integration config

  const integrations = ScmIntegrations.fromConfig(config);
  const integration = integrations.gitlab.byUrl(url);

  if (integration) {
    logger.info('GitLab integration found:', integration);
    const client = new GitLabClient(
      integration.config.apiBaseUrl || '',
      integration.config.token || '',
      logger
    );
    return client;
  } else {
    logger.error('No matching GitLab integration configuration found.');
    return null;
  }
}
export async function createRouter(
  options: RouterOptions,
): Promise<express.Router> {
  const { logger, config } = options;

  const router = Router();
  router.use(express.json());

  router.get('/health', (_, response) => {
    logger.info('PONG!');
    response.json({ status: 'ok' });
  });
  router.get('/gitlab/:projectId/pipelines', async (req, res) => {
    const projectId = req.params.projectId;
    const client = getGLClient(config, logger);

    if (!client) {
      return res.status(500).json({ error: 'Failed to initialize GitLab client' });
    }

    try {
      const pipelines = await client.fetchProjectPipelines(projectId);

      if (!pipelines) {
        logger.error(`No pipelines found for project ID: ${projectId}`);
        return res.status(404).json({ error: 'No pipelines found' });
      }
      const formattedData = pipelines.map((pipes: any) => ({
        id: pipes.id,
        project_id: pipes.project_id,
        sha: pipes.sha,
        ref: pipes.ref,
        status: pipes.status,
        web_url: pipes.web_url,
        created_at: formatDate(pipes.created_at),
        url: pipes.url,
      }));


      return res.json(formattedData);
    } catch (error) {
      logger.error(`Failed to fetch pipelines for project ID: ${projectId}`, error);
      return res.status(500).json({ error: 'Failed to fetch pipelines' });
    }
  });

  router.get('/gitlab', (_, response) => {
    //fetchProjectPipelines
    response.json(mockedData);
  });

  router.get('/jenkins', (_, response) => {
    response.json(mockedData);
  });
  // Jenkins Job Details Endpoint
  router.get('/jenkins/:jobName/pipelines', async (req, res) => {
    const jobName = req.params.jobName;
    const jenkinsBaseUrl = 'http://builder6.ecd.axway.int';
    const username = 'ccoy';
    const password = 'ab8c21e10749f6488670d7b9fa27a15a';
    const url = `${jenkinsBaseUrl}/job/${jobName}/api/json?tree=builds[number,url,result,timestamp,duration]{0,5}`;
    const auth = Buffer.from(`${username}:${password}`).toString('base64');

    const headers = {
      'Authorization': `Basic ${auth}`,
    };

    try {
      const response = await fetch(url, { headers });

      if (!response.ok) {
        logger.error(`Failed to fetch job details: HTTP status ${response.status}`);
        return res.status(response.status).json({ error: 'Failed to fetch job details' });
      }

      const jobDetails = await response.json();
      const formattedData = jobDetails.builds.map((build: any) => ({
        duration: build.duration,
        number: build.number,
        result: build.result,
        timestamp: formatTimestamp(build.timestamp),
        url: build.url,
      }));
      return res.json(formattedData);
    } catch (error) {
      logger.error(`Failed to fetch job details for job name: ${jobName}`, error);
      return res.status(500).json({ error: 'Failed to fetch job details' });
    }
  });
  router.use(errorHandler());
  return router;


}
