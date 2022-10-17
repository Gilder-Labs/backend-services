import { Governance } from '@gilder/types';
import { getGovernance } from '@solana/spl-governance';
import { ApiClient } from '../../client';
import { GET_ALL_GOVERNANCES } from '../../queries/governances';
import { getResults } from '../utils';
import { transformGovernance } from './utils';

const getAllGovernances = async (client: ApiClient): Promise<Governance[]> => {
  return getResults<Governance<string, string>[]>(
    { query: GET_ALL_GOVERNANCES },
    client,
  ).then((data) => data.map<Governance>(transformGovernance));
};

export { getAllGovernances };
