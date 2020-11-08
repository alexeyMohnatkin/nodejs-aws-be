import { APIGatewayProxyHandler } from 'aws-lambda';
import 'source-map-support/register';

import { Client, ClientConfig } from 'pg';

const { PG_HOST, PG_PORT, PG_DATABASE, PG_USERNAME, PG_PASSWORD } = process.env;

const options: ClientConfig = {
  host: PG_HOST,
  port: +PG_PORT,
  database: PG_DATABASE,
  user: PG_USERNAME,
  password: PG_PASSWORD,
  ssl: {
    rejectUnauthorized: false,
  },
  connectionTimeoutMillis: 5000,
};


const getProductByID: APIGatewayProxyHandler = async (event) => {
  console.log('getProductByID labmda executed with event: ', event);

  const client = new Client(options);
  await client.connect();

  try {
    const productId = event.pathParameters.id;

    const {rows: [product]} = await client.query(`select * from products p left join stocks s on s.product_id = p.id where p.id='${productId}'`);

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

  } catch (error) {
    console.log(error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Internal server error' }),
    };
  } finally {
    client.end()
  }
}

export default getProductByID;
