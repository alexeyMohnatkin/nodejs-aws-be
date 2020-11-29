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


type Product = {
  title: string,
  description: string,
  image: string,
  price: string,
  count: string,
}

const createProduct = async (product: Product) => {

  const client = new Client(options);
  await client.connect();
  try {
    await client.query('BEGIN');

    const { title, description, image, price, count } = product;

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
  } finally {
    client.end();
  }
}


const getProductById = async (id: string) => {

  const client = new Client(options);
  await client.connect();

  try {
    const {rows: [product]} = await client.query(`SELECT * FROM products p LEFT JOIN stocks s ON s.product_id = p.id WHERE p.id='${id}'`);
    return product;
  } catch (error) {
    console.log(error);
    throw error;
  } finally {
    client.end()
  }
}

const getProducts = async () => {
  const client = new Client(options);
  await client.connect();

  try {
    const { rows: products } = await client.query(`select * from products p left join stocks s on s.product_id = p.id `);
    return products;
  } catch (error) {
    console.log(error);
    throw error;
  } finally {
    client.end()
  }
}

export {
  createProduct,
  getProductById,
  getProducts,
};
