import { TaskScheduleDefinitionConfig } from '@backstage/backend-tasks';

export interface Config {
  tiles?: {
    schedule?: TaskScheduleDefinitionConfig;
    contexts?: {  
      [name: string]: {
        /**
         * (Required) URL for the config
         */
        url: string;
      };
    };
  };
}

