import { SQSHandler } from 'aws-lambda';
import * as AWS from "aws-sdk";
import 'source-map-support/register';

import * as database from '../api/database';


const catalogBatchProcess: SQSHandler = async (event) => {
  console.log('catalogBatchProcess labmda executed with event: ', event);

  try {
    const products = event.Records.map((record) => JSON.parse(record.body));
    console.log('importing products: \n: ', products);
    const promises = products.map(async(product) => {
      await database.createProduct(product);
    });

    await Promise.all(promises);
    console.log('Products were imported successfully');

    const sns = new AWS.SNS({ region: "eu-west-1" });
    sns.publish({
      Subject: 'Products has been imported',
      Message: JSON.stringify((products)),
      TopicArn: process.env.SNS_ARN,
    });
    console.log('SNS has sent the notification');

  } catch (error) {
    console.error('catalogBatchProcess error: \n', error);
  }
}

export default catalogBatchProcess;
