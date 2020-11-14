import { Client } from 'pg';

import { createAPIGatewayEvent } from '../APIGatewayEventMock';

import createProduct from './createProduct';

jest.mock('pg', () => {
  const mClient = {
    connect: jest.fn(),
    query: jest.fn(),
    end: jest.fn(),
  };
  return { Client: jest.fn(() => mClient) };
});

const PRODUCT_PAYLOAD = {
  title: "ProductOne",
  description: "Short Product Description1",
  image: "https://source.unsplash.com/random?sig=0",
  price: 2.4,
  count: 4,
};


describe('Lambda createProduct', () => {
  let client: { connect: jest.Mock, query: jest.Mock, end: jest.Mock };

  beforeAll(() => {
    client = new Client() as any as { connect: jest.Mock, query: jest.Mock, end: jest.Mock };
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should create new product and return it in the response', async () => {
    const newId = '7567ec4b-b10c-48c5-9345-fc73c48a80aa';
    client.query
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce({rows: [{ id: newId }]})
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce({ rows: [{ ...PRODUCT_PAYLOAD, id: newId }] });

    const event = createAPIGatewayEvent({
      body: JSON.stringify(PRODUCT_PAYLOAD),
    });

    const result = await createProduct(event, null, null);

    const expected = {
      statusCode: 200,
      body: JSON.stringify({ ...PRODUCT_PAYLOAD, id: newId }),
      headers: {
        "Access-Control-Allow-Credentials": true,
        "Access-Control-Allow-Origin": "*",
      },
    };


    expect(client.query.mock.calls).toMatchSnapshot();
    expect(result).toEqual(expected);
  });

  it('should rollback transaction if product creation failed', async () => {
    client.query
      .mockResolvedValueOnce(null)
      .mockRejectedValueOnce('Product creation failed')

    const event = createAPIGatewayEvent({
      body: JSON.stringify(PRODUCT_PAYLOAD),
    });

    const result = await createProduct(event, null, null);

    const expected = {
      statusCode: 500,
      body: JSON.stringify({ message: 'Internal server error' }),
    };

    expect(client.query.mock.calls).toMatchSnapshot();
    expect(result).toEqual(expected);
  });

  it('should rollback transaction if stock creation failed', async () => {
    const newId = '7567ec4b-b10c-48c5-9345-fc73c48a80aa';
    client.query = jest.fn()
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce({rows: [{ id: newId }]})
      .mockRejectedValueOnce('Stock creation failed')

    const event = createAPIGatewayEvent({
      body: JSON.stringify(PRODUCT_PAYLOAD),
    });

    const result = await createProduct(event, null, null);

    const expected = {
      statusCode: 500,
      body: JSON.stringify({ message: 'Internal server error' }),
    };

    expect(client.query.mock.calls).toMatchSnapshot();
    expect(result).toEqual(expected);
  });
});
