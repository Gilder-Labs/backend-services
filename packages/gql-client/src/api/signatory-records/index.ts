import { SignatoryRecord } from '@gilder/types';
import { GET_ALL_SIGNATORY_RECORDS } from '../../queries';
import { ApiClient } from '../../client';
import { getResults } from '../utils';
import { transformSignatoryRecord } from './utils';

const getAllSignatoryRecords = async (
  client: ApiClient,
): Promise<SignatoryRecord[]> => {
  return getResults<SignatoryRecord<string>[]>(
    { query: GET_ALL_SIGNATORY_RECORDS },
    client,
  ).then((data) => data.map<SignatoryRecord>(transformSignatoryRecord));
};

export { getAllSignatoryRecords };
