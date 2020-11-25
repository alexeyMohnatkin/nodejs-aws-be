import { SQSHandler } from 'aws-lambda';
import 'source-map-support/register';


const catalogBatchProcess: SQSHandler = async (event) => {
  try {
    const records = event.Records;
    console.log(records);

  } catch (error) {
    console.error('catalogBatchProcess error: \n', error);
  }
}

export default catalogBatchProcess;
