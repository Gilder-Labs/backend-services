import { Proposal } from '@gilderlabs/types';
import { PublicKey } from '@solana/web3.js';

export const transformProposal = (proposal: Proposal<string>): Proposal => {
  const { realmPk, programPk, proposalPk, ...rest } = proposal;
  return {
    ...rest,
    realmPk: new PublicKey(realmPk),
    programPk: new PublicKey(programPk),
    proposalPk: new PublicKey(proposalPk),
  };
};
