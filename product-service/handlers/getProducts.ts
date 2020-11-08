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

const getProducts: APIGatewayProxyHandler = async (event) => {
  console.log('getProducts labmda executed with event: ', event);

  const client = new Client(options);
  await client.connect();
  try {
    const { rows: products } = await client.query(`select * from products p left join stocks s on s.product_id = p.id `);
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
      },
      body: JSON.stringify({ products }),
    };
  } catch (error) {
    console.log(error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Internal server error' }),
    };
  } finally {
    client.end();
  }
}

export default getProducts;
