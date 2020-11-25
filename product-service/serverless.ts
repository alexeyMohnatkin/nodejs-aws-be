import type { Serverless } from 'serverless/aws';

const serverlessConfiguration: Serverless = {
  service: {
    name: 'product-service',
    // app and org for use with dashboard.serverless.com
    // app: your-app-name,
    // org: your-org-name,
  },
  frameworkVersion: '2',
  custom: {
    webpack: {
      webpackConfig: './webpack.config.js',
      includeModules: true
    }
  },
  // Add the serverless-webpack plugin
  plugins: [
    'serverless-webpack',
    'serverless-dotenv-plugin',
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
      SQS_URL: {
        Ref: 'SQSQueue',
      },
    },
    region: 'eu-west-1',
    iamRoleStatements: [{
      Effect: 'Allow',
      Action: 'sqs:*',
      Resource: {
        'Fn::GetAtt': ['SQSQueue', 'Arn'],
      },
    }]
  },
  resources: {
    Resources: {
      SQSQueue: {
        Type: 'AWS::SQS::Queue',
        Properties: {
          QueueName: 'catalogItemsQueue',
        }
      }
    },
    Outputs: {
      CatalogItemsQueueUrl: {
        Value: {
          Ref: "SQSQueue",
        },
        Export: {
          Name: "CatalogItemsQueueUrl",
        },
      },
      CatalogItemsQueueArn: {
        Value: {
          'Fn::GetAtt': ['SQSQueue', 'Arn']
        },
        Export: {
          Name: "CatalogItemsQueueArn",
        },
      },
    },
  },
  functions: {
    getProducts: {
      handler: 'handler.getProducts',
      events: [
        {
          http: {
            method: 'get',
            path: 'products',
            cors: {
              origins: '*',
            },
          },
        },
      ],
    },
    getProductByID: {
      handler: 'handler.getProductByID',
      events: [
        {
          http: {
            method: 'get',
            path: 'products/{id}',
            cors: {
              origins: '*'
            },
          },
        },
      ],
    },
    createProduct: {
      handler: 'handler.createProduct',
      events: [
        {
          http: {
            method: 'post',
            path: 'products',
            cors: {
              origins: '*'
            },
          },
        },
      ],
    },
    catalogBatchProcess: {
      handler: 'handler.catalogBatchProcess',
      events: [{
        sqs: {
          batchSize: 5,
          arn: {
            'Fn::GetAtt': ['SQSQueue', 'Arn'],
          }
        }
      }],
    },
  },
}

module.exports = serverlessConfiguration;
