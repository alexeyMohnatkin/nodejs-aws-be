import * as AWS from 'aws-sdk';
import { APIGatewayProxyHandler } from 'aws-lambda';
import 'source-map-support/register';

import { BUCKET_NAME } from '../constants';

const importProductsFile: APIGatewayProxyHandler = async (event) => {
  const s3 = new AWS.S3({
    region: 'eu-west-1',
  });

  try {
    const filename = event?.queryStringParameters?.filename;
    if (!filename) {
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Credentials': true,
        },
        body: JSON.stringify({ message: 'No filename specified' }),
      };
    }

    const signedUrl = await new Promise((resolve, reject) => {
      s3.getSignedUrl('putObject', {
        Bucket: BUCKET_NAME,
        Key: `uploaded/${filename}`,
        Expires: 60,
        ContentType: 'text/csv',
      }, (error, url) => {
        if (error) {
          console.log(error);
          reject('SignedUrl generation failed');
        }
        resolve(url);
      });
    });

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
      },
      body: JSON.stringify({ url: signedUrl }),
    };

  } catch (error) {
    console.log('importProductsFile error: \n');
    console.log(error);

    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
      },
      body: JSON.stringify({ message: 'Internal server error' }),
    };
  }

}

export default importProductsFile;
