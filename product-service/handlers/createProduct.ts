import { APIGatewayProxyHandler } from 'aws-lambda';
import 'source-map-support/register';

import * as database from '../api/database';

const createProduct: APIGatewayProxyHandler = async (event) => {
  console.log('createProduct labmda executed with event: ', event);

  try {
    const newId = await database.createProduct(JSON.parse(event.body));
    const product = await database.getProductById(newId);

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

export default createProduct;
