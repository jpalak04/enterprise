import { getVoidLogger } from '@backstage/backend-common';
import express from 'express';
import request from 'supertest';

import { createRouter } from './router';
import { Config } from '@backstage/config';
import { JsonValue } from '@backstage/types';

describe('createRouter', () => {
  let app: express.Express;

  const mockConfig: Config = {
    has: function (_key: string): boolean {
      throw new Error('Function not implemented.');
    },
    keys: function (): string[] {
      throw new Error('Function not implemented.');
    },
    get: function <T = JsonValue>(_key?: string | undefined): T {
      throw new Error('Function not implemented.');
    },
    getOptional: function <T = JsonValue>(_key?: string | undefined): T | undefined {
      throw new Error('Function not implemented.');
    },
    getConfig: function (_key: string): Config {
      throw new Error('Function not implemented.');
    },
    getOptionalConfig: function (_key: string): Config | undefined {
      throw new Error('Function not implemented.');
    },
    getConfigArray: function (_key: string): Config[] {
      throw new Error('Function not implemented.');
    },
    getOptionalConfigArray: function (_key: string): Config[] | undefined {
      throw new Error('Function not implemented.');
    },
    getNumber: function (_key: string): number {
      throw new Error('Function not implemented.');
    },
    getOptionalNumber: function (_key: string): number | undefined {
      throw new Error('Function not implemented.');
    },
    getBoolean: function (_key: string): boolean {
      throw new Error('Function not implemented.');
    },
    getOptionalBoolean: function (_key: string): boolean | undefined {
      throw new Error('Function not implemented.');
    },
    getString: function (_key: string): string {
      throw new Error('Function not implemented.');
    },
    getOptionalString: function (_key: string): string | undefined {
      throw new Error('Function not implemented.');
    },
    getStringArray: function (_key: string): string[] {
      throw new Error('Function not implemented.');
    },
    getOptionalStringArray: function (_key: string): string[] | undefined {
      throw new Error('Function not implemented.');
    }
  }
  beforeAll(async () => {
    const router = await createRouter({
      logger: getVoidLogger(),
      config: mockConfig
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
