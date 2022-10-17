import { PublicKey } from '@solana/web3.js';
import { ApiClient } from '../../client';
import { GET_ALL_GOVERNANCE_PROGRAMS } from '../../queries';
import { getResults } from '../utils';

export const getAllGovernancePrograms = async (
  client: ApiClient,
): Promise<PublicKey[]> => {
  return (
    await getResults<string[]>({ query: GET_ALL_GOVERNANCE_PROGRAMS }, client)
  ).map((x) => new PublicKey(x));
};
