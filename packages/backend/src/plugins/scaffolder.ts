import { CatalogClient } from '@backstage/catalog-client';
import { createRouter, createTemplateAction } from '@backstage/plugin-scaffolder-backend';
import { Router } from 'express';
import type { PluginEnvironment } from '../types';
import { applyTemplate } from '../utils/templatehelper'
// Define your custom action here.
const createHelloWorldAction = createTemplateAction<{ message: string }>({
  id: 'hello-world',
  description: 'Adds a greeting to the log',
  schema: {
    input: {
      type: 'object',
      required: ['name'],
      properties: {
        name: {
          title: 'Name',
          type: 'string',
        },
      },
    },
  },
  async handler(ctx) {
    const { message } = ctx.input;
  
    if (typeof message !== 'string') {
      throw new Error('name must be a string');
    }
  
    const content = 'Hello, {{message}}\n';  // Your template string with {{message}} as the placeholder
    const replacements = { 'name': message };
    const replacedContent = applyTemplate(content, replacements);
  
    ctx.logStream.write("Template "+replacedContent);
  },
  });

export default async function createPlugin(
  env: PluginEnvironment,
): Promise<Router> {
  const catalogClient = new CatalogClient({
    discoveryApi: env.discovery,
  });

  return await createRouter({
    logger: env.logger,
    config: env.config,
    database: env.database,
    reader: env.reader,
    catalogClient,
    identity: env.identity,
    permissions: env.permissions,
    // Pass your action in an array to the `actions` field in createRouter.
    actions: [createHelloWorldAction],
  });
}