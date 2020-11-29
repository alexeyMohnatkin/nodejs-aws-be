import { APIGatewayProxyHandler } from 'aws-lambda';
import 'source-map-support/register';

import * as database from '../api/database';

const getProducts: APIGatewayProxyHandler = async (event) => {
  console.log('getProducts labmda executed with event: ', event);


  try {
    const products = await database.getProducts();
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
      },
      body: JSON.stringify({ products }),
    };
  } catch (error) {
    console.log(error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Internal server error' }),
    };
  }
}

export default getProducts;
