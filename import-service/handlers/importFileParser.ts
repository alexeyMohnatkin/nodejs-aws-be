import * as AWS from 'aws-sdk';
import * as csv from 'csv-parser';
import { S3Handler } from 'aws-lambda';
import 'source-map-support/register';

import { BUCKET_NAME } from '../constants';

const importFileParser: S3Handler = async (event) => {
  try {
    const s3 = new AWS.S3({
      region: 'eu-west-1'
    });

    const record = event.Records[0];

    const s3Object = record.s3.object;

    const s3Stream = s3.getObject({
      Bucket: BUCKET_NAME,
      Key: s3Object.key,
    }).createReadStream();

    const results = [];

    s3Stream
      .pipe(csv({ separator: ';' }))
      .on('data', (data) => {
        console.log(data);

        results.push(data)
      })
      .on('end', () => {
        console.log(results);
        console.log('end');
      });

    await s3.copyObject({
      Bucket: BUCKET_NAME,
      CopySource: `${BUCKET_NAME}/${s3Object.key}`,
      Key: s3Object.key.replace('uploaded', 'parsed'),
    }).promise();

    await s3.deleteObject({
      Bucket: BUCKET_NAME,
      Key: s3Object.key,
    }).promise();

  } catch (error) {
    console.log('importFileParser error: \n');
    console.log(error);

  }
}

export default importFileParser;
