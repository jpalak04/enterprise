import { readTaskScheduleDefinitionFromConfig } from '@backstage/backend-tasks';
import { Config } from '@backstage/config';
import { TaskScheduleDefinitionConfig } from '@backstage/backend-tasks';

export interface GitlabTilesConfig {
    contexts: Array<{
      id: string;
      url: string;
    }>;
    schedule: TaskScheduleDefinitionConfig;
  }
  export function readTilesConfig(config: Config): GitlabTilesConfig {
    // Access the base 'tiles' configuration
    const tilesConfig = config.getConfig('tiles');
  
    // Retrieve the schedule if available
    const scheduleConfig = tilesConfig.getOptionalConfig('schedule');
    const schedule = scheduleConfig
      ? readTaskScheduleDefinitionFromConfig(scheduleConfig)
      : {
        frequency: { minutes: 1 },  // Task frequency
        timeout: { minutes: 1 },    // Task timeout 
        };
  
    // Access and iterate over the 'contexts' configuration
    const contextsConfig = tilesConfig.getConfig('contexts');
    const contextKeys = contextsConfig.keys();
  
    const contexts = contextKeys.map(id => {
      const contextConfig = contextsConfig.getConfig(id);
      const url = contextConfig.getString('url');
  
      return {
        id,
        url,
      };
    });
  
    return {
      contexts,
      schedule,  // Apply the common schedule to all contexts
    };
  }
