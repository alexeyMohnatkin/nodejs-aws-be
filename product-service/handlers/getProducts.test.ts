import { Client } from 'pg';

import { createAPIGatewayEvent } from '../APIGatewayEventMock';
import getProducts from './getProducts';

jest.mock('pg', () => {
  const mClient = {
    connect: jest.fn(),
    query: jest.fn(),
    end: jest.fn(),
  };
  return { Client: jest.fn(() => mClient) };
});

const PRODUCTS_MOCK = [
  {
    id: "7567ec4b-b10c-48c5-9345-fc73c48a80aa",
    title: "ProductOne",
    description: "Short Product Description1",
    price: '2.40',
    count: 4,
  },
  {
    id: "7567ec4b-b10c-48c5-9345-fc73c48a80a0",
    title: "ProductNew",
    description: "Short Product Description3",
    price: '10.00',
    count: 6,
  },
]

describe('Lambda getProducts', () => {
  let client: { connect: jest.Mock, query: jest.Mock, end: jest.Mock };

  beforeAll(() => {
    client = new Client() as any as { connect: jest.Mock, query: jest.Mock, end: jest.Mock };
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return products list', async () => {
    client.query.mockResolvedValueOnce({ rows: PRODUCTS_MOCK });
    const event = createAPIGatewayEvent();

    const result = await getProducts(event, null, null);

    const expected = {
      statusCode: 200,
      body: JSON.stringify({ products: PRODUCTS_MOCK }),
      headers: {
        "Access-Control-Allow-Credentials": true,
        "Access-Control-Allow-Origin": "*",
      },
    };

    expect(result).toEqual(expected);
  });
});
