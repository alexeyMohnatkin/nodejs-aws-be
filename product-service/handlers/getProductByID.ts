import { APIGatewayProxyHandler } from 'aws-lambda';
import 'source-map-support/register';

import products from './products.json';

const getProductByID: APIGatewayProxyHandler = async (event) => {
  const productId = event.pathParameters.id
  // try {
  //   const product = await ProductModel.findById(productId);
  //   if (!product) {
  //     return {
  //       statusCode: 404,
  //       body: JSON.stringify({
  //         message: 'Product not found',
  //       }),
  //     };
  //   }
  //   return {
  //     statusCode: 200,
  //     body: JSON.stringify(product),
  //   };
  // } catch (error) {
  //   return {
  //     statusCode: 500,
  //     body: JSON.stringify({ message: 'Something went wrong' }),
  //   };
  // }

  const product = products.find(({id}) => id === productId);


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
}

export default getProductByID;
