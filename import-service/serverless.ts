import type { Serverless } from 'serverless/aws';

const BUCKET_NAME = 'dizzy-rs-app-import-bucket';

const serverlessConfiguration: Serverless = {
  service: {
    name: 'import-service',
    // app and org for use with dashboard.serverless.com
    // app: your-app-name,
    // org: your-org-name,
  },
  frameworkVersion: '2',
  custom: {
    webpack: {
      webpackConfig: './webpack.config.js',
      includeModules: true
    },
  },
  plugins: [
    'serverless-webpack',
    'serverless-offline',
  ],
  provider: {
    name: 'aws',
    runtime: 'nodejs12.x',
    apiGateway: {
      minimumCompressionSize: 1024,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      SQS_URL: {"Fn::ImportValue": "CatalogItemsQueueUrl"},
      BUCKET_NAME: BUCKET_NAME,
    },
    region: 'eu-west-1',
    iamRoleStatements: [{
      Effect: 'Allow',
      Action: 's3:ListBucket',
      Resource: {
        'Fn::GetAtt': ['ImportBucket', 'Arn'],
      },
    },{
      Effect: 'Allow',
      Action: 's3:*',
      Resource: [{
        'Fn::Join': ['', ['arn:aws:s3:::',  { Ref: 'ImportBucket' }, '/*']]
      }]
    },{
      Effect: 'Allow',
      Action: 'sqs:*',
      Resource: {
        "Fn::ImportValue": "CatalogItemsQueueArn"
      },
    }],
  },
  resources: {
    Resources: {
      ImportBucket: {
        Type: 'AWS::S3::Bucket',
        Properties: {
          BucketName: BUCKET_NAME,
          AccessControl: 'PublicRead',
          CorsConfiguration: {
            CorsRules: [{
              "AllowedHeaders": ["*"],
              "AllowedMethods": ["PUT", "POST", "DELETE"],
              "AllowedOrigins": ["http://localhost:3000"],
              "ExposedHeaders": [],
            },
            {
              "AllowedHeaders": ["*"],
              "AllowedMethods": ["PUT", "POST", "DELETE"],
              "AllowedOrigins": ["https://d21tkn9gbb6vp3.cloudfront.net"],
              "ExposedHeaders": [],
            },
            {
              "AllowedHeaders": [],
              "AllowedMethods": ["GET"],
              "AllowedOrigins": ["*"],
              "ExposedHeaders": [],
            }],
          },
        },
      },
      ImportBucketPolicy: {
        Type: 'AWS::S3::BucketPolicy',
        Properties: {
          Bucket: {
            Ref: 'ImportBucket',
          },
          PolicyDocument: {
            Statement: [{
                Sid: 'AllowImportBucketAccessIdentity',
                Effect: 'Allow',
                Principal: '*',
                Action: 's3:GetObject',
                Resource: [{
                  'Fn::Join': ['', ['arn:aws:s3:::',  { Ref: 'ImportBucket' }, '/*']],
                }],
            }],
          },
        },
      },
    },
  },
  functions: {
    importProductsFile: {
      handler: 'handler.importProductsFile',
      events: [{
        http: {
          method: 'get',
          path: 'import',
          cors: {
            origins: '*',
          },
        }
      }],
    },
    importFileParser: {
      handler: 'handler.importFileParser',
      events: [{
        s3: {
          bucket: BUCKET_NAME,
          event: 's3:ObjectCreated:*',
          rules: [{
            prefix: 'uploaded',
            suffix: '.csv',
          }],
          existing: true,
        }
      }],
    },
  },
}

module.exports = serverlessConfiguration;
