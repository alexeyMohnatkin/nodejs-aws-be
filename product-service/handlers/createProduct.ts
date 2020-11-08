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


const createProduct: APIGatewayProxyHandler = async (event) => {
  console.log('createProduct labmda executed with event: ', event);

  const client = new Client(options);
  await client.connect();

  const createProduct = async () => {
    try {
      await client.query('BEGIN');

      const { title, description, image, price, count } = JSON.parse(event.body);

      const { rows: [{ id: newId }] } = await client.query(`INSERT INTO products (title, description, image, price) VALUES
        ('${title}', '${description}', '${image}', '${price}')
        RETURNING id;
      `);

      await client.query(`INSERT INTO stocks (product_id, count) VALUES
        ('${newId}', ${count});
      `);
      await client.query('COMMIT');
      return newId;

    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    }
  }

  try {

    const newId = await createProduct();
    const {rows: [product]} = await client.query(`SELECT * FROM products p LEFT JOIN stocks s ON s.product_id = p.id WHERE p.id='${newId}'`);

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

export default createProduct;
