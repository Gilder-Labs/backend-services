import { ApiClient } from '../../client';
import { GET_ALL_GOVERNANCE_PROGRAMS } from '../../queries';
import { getResults } from '../utils';

export const getAllGovernancePrograms = async (
  client: ApiClient,
): Promise<string[]> => {
  return getResults<string[]>({ query: GET_ALL_GOVERNANCE_PROGRAMS }, client);
};
