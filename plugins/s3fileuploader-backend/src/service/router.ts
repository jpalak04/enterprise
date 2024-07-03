import { errorHandler } from '@backstage/backend-common';
import { Config } from '@backstage/config';
import express from 'express';
import Router from 'express-promise-router';

import multer from 'multer';

import { Logger } from 'winston';

export interface RouterOptions {
  logger: Logger;
  config: Config;
}

export async function createRouter(
  options: RouterOptions,
): Promise<express.Router> {
  const logger = options.logger;
  const cfg = options.config;


  const router = Router();
  router.use(express.json());

  const AWS = require('aws-sdk');


  router.get('/health', (_, response) => {
    logger.info('PONG!');
    response.json({ status: 'ok' });
  });

  router.post('/upload', (req: express.Request, res: express.Response, next) => {
    // Use multer middleware to parse the form data

    multer().single('file')(req, res, async function (err: any) {
      if (err) {
        console.error('Multer error:', err);
        return next(err);
      }
      //      const theFile = req.file as Express.Multer.File;
      // After multer processes the request, log relevant parts
      console.log('Files:', req.file); // Log the file object
      console.log('Body:', req.body); // Log non-file fields
      console.log("AWS Info: " + req.body.awsAccount);

      const awsAccount = req.body.awsAccount;
      // Retrieve the entire awsAccounts array from the configuration
      const awsAccountsConfig = cfg.getOptionalConfigArray('ceDeployment.awsAccounts');
      if (!awsAccountsConfig) {
        return res.status(404).json({ message: 'AWS accounts configuration not found' });
      }

      // Find the specific AWS account configuration
      const accountConfig = awsAccountsConfig.find(account => account.getString('value') === awsAccount);
      if (!accountConfig) {
        return res.status(404).json({ message: 'Specified AWS account not found in configuration' });
      }

      // Access the S3 configuration for the selected account
      const accessKeyId = accountConfig.getString('s3.accessKey');
      const secretAccessKey = accountConfig.getString('s3.accessKeySecret');
      const region = accountConfig.getString('s3.awsRegion');
      const bucket = accountConfig.getString('s3.bucket');

      // Initialize AWS S3 client with the selected AWS account's configuration
      const s3 = new AWS.S3({
        accessKeyId,
        secretAccessKey,
        region,
      });

      if (req.file) {
        const uploadParams = {
          Bucket: bucket,
          Key: `${Date.now()}_${req.file.originalname}`, // Example key, consider a more unique naming strategy
          Body: req.file.buffer, // Use the file buffer directly from Multer's memory storage
          ContentType: req.file.mimetype, // Set the content type for the S3 object
        };

        // Perform the upload to S3
        try {
          const uploadResult = await s3.upload(uploadParams).promise();
          console.log('Upload Success', uploadResult.Location);
          res.json({ message: 'File upload successful', location: uploadResult.Location });
        } catch (uploadError) {
          console.error('Upload to S3 failed:', uploadError);
          return res.status(500).json({ message: 'Upload to S3 failed', error: uploadError });
        } 
      } else {
        console.log('No file received');
        res.status(400).json({ message: 'No file received' });
      }
    });
  });

  router.post('/upload2', (req, res) => {
    console.log("Req Info: " + req);
    if (req.file) {
      logger.info('File Info', req.file);
      res.json({ message: 'File upload received! Check server logs for file info.' });
    } else {
      console.log('No file received');
      res.status(400).json({ message: 'No file received' });
    }
  });

  router.use(errorHandler());
  return router;
}
