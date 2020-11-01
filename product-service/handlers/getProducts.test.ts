import getProducts from './getProducts';

import products from './products.json';

describe('Lambda getProducts', () => {
  it('should return products list', async () => {

    // @ts-ignore
    const result = await getProducts();

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
