import { APIGatewayProxyHandler } from 'aws-lambda';
import 'source-map-support/register';

import products from './products.json';

const getProducts: APIGatewayProxyHandler = async () => {
  // try {
  //   const products = await ProductModel.find({});
  //   return {
  //     statusCode: 200,
  //     body: JSON.stringify({ products }),
  //   };

  // } catch (error) {
  //   return {
  //     statusCode: 500,
  //     body: JSON.stringify({ message: 'Something went wrong' }),
  //   };
  // }

  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
    },
    body: JSON.stringify({ products }),
  };
}

export default getProducts;
