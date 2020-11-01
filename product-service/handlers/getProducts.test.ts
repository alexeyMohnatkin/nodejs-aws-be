import getProducts from './getProducts';

import * as products from './products.json';

describe('Lambda getProducts', () => {
  it('should return products list', async () => {
    const event = {
      httpMethod: 'GET'
    }

    // @ts-ignore
    const result = await getProducts(event);

    const expected = {
      statusCode: 200,
      body: JSON.stringify({ products })
    };

    expect(result).toEqual(expected);
  });
});
