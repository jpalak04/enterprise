export interface Config {
    /** Configuration options for the Deployment plugin */
    ceDeployment?: {
      /** @visibility frontend */
      products?: Array<{
        /** @visibility frontend */
        value: string; // Assuming every product should have a value, hence not optional
      }>;
      
      /** @visibility frontend */
      awsAccounts?: Array<{
        /** @visibility frontend */
        value: string; // Assuming every AWS account should have a value, hence not optional
  
        /** @visibility frontend */
        label?: string;

        s3: { // Adding S3 configuration details for each AWS account
          accessKey: string;
          accessKeySecret: string;
          awsRegion: string;
          bucket: string;
        };
      }>;
    };
  }
  