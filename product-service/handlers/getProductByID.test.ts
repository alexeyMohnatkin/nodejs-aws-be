import { Client } from 'pg';

import { createAPIGatewayEvent } from '../APIGatewayEventMock';

import getProductByID from './getProductByID';

jest.mock('pg', () => {
  const mClient = {
    connect: jest.fn(),
    query: jest.fn(),
    end: jest.fn(),
  };
  return { Client: jest.fn(() => mClient) };
});

const PRODUCT_MOCK = {
  id: "7567ec4b-b10c-48c5-9345-fc73c48a80aa",
  title: "ProductOne",
  description: "Short Product Description1",
  price: '2.40',
  count: 4,
};

describe('Lambda getProductByID', () => {
  let client: { connect: jest.Mock, query: jest.Mock, end: jest.Mock };

  beforeAll(() => {
    client = new Client() as any as { connect: jest.Mock, query: jest.Mock, end: jest.Mock };
  });
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return product', async () => {
    client.query.mockResolvedValueOnce({ rows: [PRODUCT_MOCK] });
    const productId = 'existing-uuid';
    const event = createAPIGatewayEvent({
      pathParameters: {
        id: productId
      }
    });


    const result = await getProductByID(event, null, null);

    const expected = {
      statusCode: 200,
      body: JSON.stringify(PRODUCT_MOCK),
      headers: {
        "Access-Control-Allow-Credentials": true,
        "Access-Control-Allow-Origin": "*",
      },
    };


    expect(client.query.mock.calls).toEqual([[`select * from products p left join stocks s on s.product_id = p.id where p.id='${productId}'`]]);
    expect(result).toEqual(expected);
  });

  it('should return 404 if product doesn\'t exist', async () => {
    client.query.mockResolvedValueOnce({ rows: [] });
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

    expect(client.query.mock.calls).toEqual([[`select * from products p left join stocks s on s.product_id = p.id where p.id='${productId}'`]]);
    expect(result).toEqual(expected);
  });
});
