import getProductByID from './getProductByID';

import products from './products.json';

describe('Lambda getProductByID', () => {
  it('should return product', async () => {
    const productId = '7567ec4b-b10c-48c5-9345-fc73c48a80aa';
    const event = {
      httpMethod: 'GET',
      pathParameters: {
        id: productId
      }
    }

    const product = products.find(({id}) => id === productId);

    // @ts-ignore
    const result = await getProductByID(event);

    const expected = {
      statusCode: 200,
      body: JSON.stringify(product)
    };

    expect(result).toEqual(expected);
  });
  it('should return 404 if product doesn\'t exist', async () => {
    const productId = 'wrong-product-id';
    const event = {
      httpMethod: 'GET',
      pathParameters: {
        id: productId
      }
    }

    // @ts-ignore
    const result = await getProductByID(event);

    const expected = {
      statusCode: 404,
      body: JSON.stringify({message: 'Product not found'})
    };

    expect(result).toEqual(expected);
  });
});
