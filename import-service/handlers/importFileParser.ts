import * as AWS from 'aws-sdk';
import * as csv from 'csv-parser';
import { S3Handler } from 'aws-lambda';
import 'source-map-support/register';

const importFileParser: S3Handler = async (event, _context, callback) => {
  try {
    const s3 = new AWS.S3({
      region: 'eu-west-1'
    });

    const { BUCKET_NAME } = process.env;

    const record = event.Records[0];
    const s3Object = record.s3.object;

    const s3Stream = s3.getObject({
      Bucket: BUCKET_NAME,
      Key: s3Object.key,
    }).createReadStream();

    const sqs = new AWS.SQS()

    console.log('Start parsing...');
    await new Promise((resolve) => {
      s3Stream
        .pipe(csv({ separator: ';' }))
        .on('data', (item) => {
          console.log('Item parsed: \n', item);
          sqs.sendMessage({
            QueueUrl: process.env.SQS_URL,
            MessageBody: JSON.stringify(item),
          }, (err, data) => {
            if (err) {
              console.error(err);
              return;
            }
            console.log('importFileParser sent new record to the queue: \n', data);
          })
        })
        .on('end', async () => {
          console.log('Parsing complete');

          await s3.copyObject({
            Bucket: BUCKET_NAME,
            CopySource: `${BUCKET_NAME}/${s3Object.key}`,
            Key: s3Object.key.replace('uploaded', 'parsed'),
          }).promise();

          await s3.deleteObject({
            Bucket: BUCKET_NAME,
            Key: s3Object.key,
          }).promise();

          resolve();
        })
    })

    callback(null);

  } catch (error) {
    console.error('importFileParser error: \n', error);
    callback(error);
  }
}

export default importFileParser;
