import { APIGatewayAuthorizerHandler } from 'aws-lambda';
import 'source-map-support/register';

import * as auth from 'basic-auth';

const generatePolicy = (principalId: string, resource: string, effect: 'Allow' | 'Deny') => {
  return {
    principalId: principalId,
    policyDocument: {
      Version: '2012-10-17',
      Statement: [
        {
          Action: 'execute-api:Invoke',
          Effect: effect,
          Resource: resource,
        },
      ],
    },
  };
}

const basicAuthorizer: APIGatewayAuthorizerHandler = (event, _context, cb) => {
  console.log('basicAuthorizer labmda executed with event: ', event);

  if (event.type !== 'TOKEN') {
    cb('Unauthorized');
    return;
  }

  try {
    const { name, pass } = auth.parse(event.authorizationToken);
    const isAuthorized = process.env.login === name && process.env.password === pass;
    const effect = isAuthorized ? 'Allow' : 'Deny';
    cb(null, generatePolicy('import', event.methodArn, effect));
  } catch (error) {
    console.error(error);
    cb('Unauthorized');
  }

}

export default basicAuthorizer;
