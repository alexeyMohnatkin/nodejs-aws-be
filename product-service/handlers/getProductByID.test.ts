import { createAPIGatewayEvent } from '../APIGatewayEventMock';

import getProductByID from './getProductByID';
import products from './products.json';

describe('Lambda getProductByID', () => {
  it('should return product', async () => {
    const productId = '7567ec4b-b10c-48c5-9345-fc73c48a80aa';
    const event = createAPIGatewayEvent({
      pathParameters: {
        id: productId
      }
    });

    const product = products.find(({id}) => id === productId);

    const result = await getProductByID(event, null, null);

    const expected = {
      statusCode: 200,
      body: JSON.stringify(product),
      headers: {
        "Access-Control-Allow-Credentials": true,
        "Access-Control-Allow-Origin": "*",
      },
    };

    expect(result).toEqual(expected);
  });
  it('should return 404 if product doesn\'t exist', async () => {
    const productId = 'wrong-product-id';
    const event = createAPIGatewayEvent({
      pathParameters: {
        id: productId
      }
    });

    const result = await getProductByID(event, null, null);

    const expected = {
      statusCode: 404,
      body: JSON.stringify({message: 'Product not found'}),
    };

    expect(result).toEqual(expected);
  });
});
