import { VoteRecord } from '@gilder/types';
import { PublicKey } from '@solana/web3.js';
import * as BN from 'bn.js';

export const transformVoteRecord = ({
  programPk,
  proposalPk,
  governingTokenOwnerPk,
  yesVoteWeight,
  noVoteWeight,
  voteWeight,
  voterWeight,
  ...rest
}: VoteRecord<string, string>): VoteRecord => {
  return {
    ...rest,
    proposalPk: new PublicKey(proposalPk),
    programPk: new PublicKey(programPk),
    governingTokenOwnerPk: new PublicKey(governingTokenOwnerPk),
    noVoteWeight: noVoteWeight ? new BN.BN(noVoteWeight) : undefined,
    yesVoteWeight: yesVoteWeight ? new BN.BN(yesVoteWeight) : undefined,
    voteWeight: voteWeight
      ? {
          no: new BN.BN(voteWeight.no),
          yes: new BN.BN(voteWeight.yes),
        }
      : undefined,
    voterWeight: voterWeight ? new BN.BN(voterWeight) : undefined,
  };
};
