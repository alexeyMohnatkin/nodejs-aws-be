import { APIGatewayProxyEvent } from 'aws-lambda';

const DEFAULT_MOCK: APIGatewayProxyEvent = {
  body: null,
  headers: {},
  multiValueHeaders: {},
  httpMethod: 'GET',
  isBase64Encoded: false,
  path: '',
  pathParameters: null,
  queryStringParameters: null,
  multiValueQueryStringParameters: null,
  stageVariables: null,
  requestContext: null,
  resource: '',
}

export const createAPIGatewayEvent = (event?: Partial<APIGatewayProxyEvent>) => ({
  ...DEFAULT_MOCK,
  ...event,
});
