import { APIGatewayProxyHandler } from 'aws-lambda';
import 'source-map-support/register';

import * as database from '../api/database';

const getProductByID: APIGatewayProxyHandler = async (event) => {
  console.log('getProductByID labmda executed with event: ', event);

  try {
    const productId = event.pathParameters.id;

    const product = await database.getProductById(productId)
    if (!product) {
      return {
        statusCode: 404,
        body: JSON.stringify({
          message: 'Product not found',
        }),
      };
    }
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
      },
      body: JSON.stringify(product),
    };

  } catch (error) {
    console.log(error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Internal server error' }),
    };
  }
}

export default getProductByID;
