import { getVoidLogger } from '@backstage/backend-common';
import express from 'express';
import request from 'supertest';
import { createRouter } from './router';
import { DatabaseService } from '@backstage/backend-plugin-api';

describe('createRouter', () => {
  // Mock database service
  const mockDbService: DatabaseService = {
    getClient: jest.fn(),
  };

  let app: express.Express;

  beforeAll(async () => {
    const router = await createRouter({
      logger: getVoidLogger(),
      db: mockDbService,
    });
    app = express().use(router);
  });

  beforeEach(() => {
    jest.resetAllMocks();
  });

  describe('GET /health', () => {
    it('returns ok', async () => {
      const response = await request(app).get('/health');

      expect(response.status).toEqual(200);
      expect(response.body).toEqual({ status: 'ok' });
    });
  });
});
