// dbService.ts
import { LoggerService } from '@backstage/backend-plugin-api';
import { Knex } from 'knex';

export interface IConfigService {
    createConfiguration(key: string, value: string, json_value: string): Promise<{ id: number }>;
    getConfiguration(key: string): Promise<any>;
    updateConfiguration(key: string, value: string, json_value: string): Promise<{ message: string }>;
    deleteConfiguration(key: string): Promise<{ message: string }>;
    }
export class ConfigService implements IConfigService{
  private conn: Knex;
  private logger: LoggerService;

  constructor(conn: Knex, logger: LoggerService) {
    this.conn = conn;
    this.logger = logger;
  }

  async createConfiguration(key: string, value: string, json_value: string) {
    try {
      const [id] = await this.conn('dbconfig').insert({
        key,
        value,
        json_value
      }).returning('sequence_id');
      return { id };
    } catch (error) {
      this.logger.error(`Error inserting configuration: ${error}`);
      throw new Error('Internal Server Error');
    }
  }

  async getConfiguration(key: string) {
    try {
      const config = await this.conn('dbconfig').where({ key }).first();
      if (!config) {
        return null;
      }
      return config;
    } catch (error) {
      this.logger.error(`Error retrieving configuration: ${error}`);
      throw new Error('Internal Server Error');
    }
  }

  async updateConfiguration(key: string, value: string, json_value: string) {
    try {
      const updated = await this.conn('dbconfig')
        .where({ key })
        .update({ value, json_value });
      if (!updated) {
        throw new Error('Configuration not found');
      }
      return { message: 'Configuration updated' };
    } catch (error) {
      this.logger.error(`Error updating configuration: ${error}`);
      throw new Error('Internal Server Error');
    }
  }

  async deleteConfiguration(key: string) {
    try {
      const deleted = await this.conn('dbconfig')
        .where({ key })
        .del();
      if (!deleted) {
        throw new Error('Configuration not found');
      }
      return { message: 'Configuration deleted' };
    } catch (error) {
      this.logger.error(`Error deleting configuration: ${error}`);
      throw new Error('Internal Server Error');
    }
  }
}
