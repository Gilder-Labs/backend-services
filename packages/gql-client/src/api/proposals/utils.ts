import { Proposal } from '@gilder/types';
import { PublicKey } from '@solana/web3.js';

export const transformProposal = ({
  realmPk,
  programPk,
  governancePk,
  proposalPk,
  ...rest
}: Proposal<string>): Proposal => {
  return {
    ...rest,
    realmPk: new PublicKey(realmPk),
    programPk: new PublicKey(programPk),
    governancePk: new PublicKey(governancePk),
    proposalPk: new PublicKey(proposalPk),
  };
};
