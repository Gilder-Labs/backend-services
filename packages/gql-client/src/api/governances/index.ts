import { Governance } from '@gilder/types';
import { GET_ALL_GOVERNANCES } from 'src/queries';
import { ApolloClient } from '../types';
import { getResults } from '../utils';
import { transformGovernance } from './utils';

const getAllGovernances = async (
  client: ApolloClient,
): Promise<Governance[]> => {
  return getResults<Governance<string, string>[]>(
    { query: GET_ALL_GOVERNANCES },
    client,
  ).then((data) => data.map<Governance>(transformGovernance));
};

export { getAllGovernances };
