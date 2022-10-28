import { PublicKey } from '@solana/web3.js';
import { ApiClient } from '../../client';
import { GET_ALL_GOVERNANCE_PROGRAM_PKS } from '../../queries';
import { getResults } from '../utils';

interface GovernanceProgram {
  governanceProgramPk: string;
}

export const getAllGovernancePrograms = async (
  client: ApiClient,
): Promise<PublicKey[]> => {
  return (
    await getResults<GovernanceProgram[]>(
      { query: GET_ALL_GOVERNANCE_PROGRAM_PKS },
      client,
    )
  ).map((x) => new PublicKey(x.governanceProgramPk));
};
