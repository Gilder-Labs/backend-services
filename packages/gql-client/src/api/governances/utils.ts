import { Governance } from '@gilder/types';
import { VoteThreshold } from '@solana/spl-governance';
import { PublicKey } from '@solana/web3.js';
import * as BN from 'bn.js';

export const transformGovernance = ({
  realmPk,
  programPk,
  governancePk,
  governedAccountPk,
  config,
  ...rest
}: Governance<string, string>): Governance => {
  const {
    minCommunityTokensToCreateProposal,
    minCouncilTokensToCreateProposal,
    communityVetoVoteThreshold,
    communityVoteTipping,
    communityVoteThreshold,
    councilVetoVoteThreshold,
    councilVoteThreshold,
    councilVoteTipping,
    maxVotingTime,
    minInstructionHoldUpTime,
  } = config;
  return {
    ...rest,
    realmPk: new PublicKey(realmPk),
    governancePk: new PublicKey(governancePk),
    governedAccountPk: new PublicKey(governedAccountPk),
    programPk: new PublicKey(programPk),
    config: {
      communityVoteThreshold: new VoteThreshold(communityVoteThreshold),
      communityVetoVoteThreshold: new VoteThreshold(communityVetoVoteThreshold),
      communityVoteTipping: communityVoteTipping,
      councilVoteThreshold: new VoteThreshold(councilVoteThreshold),
      councilVoteTipping: councilVoteTipping,
      councilVetoVoteThreshold: new VoteThreshold(councilVetoVoteThreshold),
      minCommunityTokensToCreateProposal: new BN.BN(
        minCommunityTokensToCreateProposal,
      ),
      minCouncilTokensToCreateProposal: new BN.BN(
        minCouncilTokensToCreateProposal,
      ),
      maxVotingTime: maxVotingTime,
      minInstructionHoldUpTime: minInstructionHoldUpTime,
    },
  };
};
