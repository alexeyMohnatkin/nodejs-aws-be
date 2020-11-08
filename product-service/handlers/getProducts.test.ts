import { createAPIGatewayEvent } from '../APIGatewayEventMock';

import getProducts from './getProducts';
import products from './products.json';

describe('Lambda getProducts', () => {
  it('should return products list', async () => {

    const event = createAPIGatewayEvent();

    const result = await getProducts(event, null, null);

    const expected = {
      statusCode: 200,
      body: JSON.stringify({ products }),
      headers: {
        "Access-Control-Allow-Credentials": true,
        "Access-Control-Allow-Origin": "*",
      },
    };

    expect(result).toEqual(expected);
  });
});
