import { VoteRecord } from '@gilder/types';
import { GET_ALL_VOTE_RECORDS } from '../../queries';
import { ApiClient } from '../../client';
import { getResults } from '../utils';
import { transformVoteRecord } from './utils';

const getAllVoteRecords = async (client: ApiClient): Promise<VoteRecord[]> => {
  return getResults<VoteRecord<string, string>[]>(
    { query: GET_ALL_VOTE_RECORDS },
    client,
  ).then((data) => data.map<VoteRecord>(transformVoteRecord));
};

export { getAllVoteRecords };
