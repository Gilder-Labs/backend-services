import { GET_ALL_GOVERNANCE_PROGRAMS } from '../../queries';
import { ApolloClient } from '../types';
import { getResults } from '../utils';

export const getAllGovernancePrograms = async (
  client: ApolloClient,
): Promise<string[]> => {
  return getResults<string[]>({ query: GET_ALL_GOVERNANCE_PROGRAMS }, client);
};
