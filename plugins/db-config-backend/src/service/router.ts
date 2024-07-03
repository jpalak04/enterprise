
// router.ts
import { errorHandler, resolvePackagePath } from '@backstage/backend-common';
import { DatabaseService, LoggerService } from '@backstage/backend-plugin-api';
import express from 'express';
import Router from 'express-promise-router';
import { ConfigService } from '../lib/dbService'; // Import the service
import { processProductTileNoop, validateAndProcessYAML } from '../lib/validator';
import bodyParser from 'body-parser';

export interface RouterOptions {
  logger: LoggerService;
  db: DatabaseService;
}

export async function createRouter(options: RouterOptions): Promise<express.Router> {
  const { logger, db } = options;
  const conn = await db.getClient();
  const configService = new ConfigService(conn, logger);

  const router = Router();
  router.use(express.json());

  // Middleware for parsing YAML content
  // Middleware to handle text/yaml content type as plain text
  router.use(bodyParser.text({ type: 'text/yaml' }));

  router.get('/health', (_, response) => {
    logger.info('PONG!');
    response.json({ status: 'ok' });
  });

  router.post('/config', async (req, res) => {
    try {
      const { key, value, json_value } = req.body;
      const result = await configService.createConfiguration(key, value, json_value);
      res.status(201).json(result);
    } catch (error) {
      logger.error(`Error creating configuration: ${error}`);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  router.get('/config/:key', async (req, res) => {
    try {
      const { key } = req.params;
      const config = await configService.getConfiguration(key);
      res.json(config);
    } catch (error) {
      logger.error(`Error getting configuration: ${error}`);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  router.put('/config/:key', async (req, res) => {
    try {
      const { key } = req.params;
      const { value, json_value } = req.body;
      const result = await configService.updateConfiguration(key, value, json_value);
      res.json(result);
    } catch (error) {
      logger.error(`Error updating configuration: ${error}`);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  router.delete('/config/:key', async (req, res) => {
    try {
      const { key } = req.params;
      const result = await configService.deleteConfiguration(key);
      res.json(result);
    } catch (error) {
      logger.error(`Error processing DELETE request: ${error}`);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
// Route to handle POST requests
router.post('/validate', (req, res) => {
    const yamlContent = req.body;

    const schemaPath=resolvePackagePath('@internal/backstage-plugin-db-config-backend', "schema/config.json")
    const schema = require(schemaPath); // Load the generated schema

    
    try {
      const context = req.query.context?.toString() || ''; // Convert context to string and provide a default value if it is undefined

      // Invoke the processing function
      logger.info(`Processing YAML content for context: ${context}`);
      validateAndProcessYAML(
        yamlContent,
        context,
        schema,
        processProductTileNoop,
        new ConfigService(conn, logger)
      );
      res.send({message: 'YAML processed successfully.'});
    } catch (error) {
      console.error('Failed to process YAML:', error);
      res.status(500).send({ message: `Failed to process YAML. ${error}`});
    }
  });

  router.use(errorHandler());
  return router;
}
