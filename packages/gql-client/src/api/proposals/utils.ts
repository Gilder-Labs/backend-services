import { Proposal, ProposalOption, VoteType } from '@gilder/types';
import {
  ProposalOption as SolanaProposalOption,
  VoteThreshold,
  VoteType as SolanaVoteType,
} from '@solana/spl-governance';
import { PublicKey } from '@solana/web3.js';
import * as BN from 'bn.js';

export const transformProposal = ({
  realmPk,
  programPk,
  governancePk,
  proposalPk,
  abstainVoteWeight,
  denyVoteWeight,
  maxVoteWeight,
  vetoVoteWeight,
  governingTokenMintPk,
  tokenOwnerRecordPk,
  voteThreshold,
  yesVoteOption,
  yesVoteCount,
  noVoteCount,
  options,
  votingAtSlot,
  voteType,
  draftAt,
  closedAt,
  votingAt,
  stateTimestamp,
  signingOffAt,
  votingCompletedAt,
  startVotingAt,
  estimatedVoteCompletionAt,
  executingAt,
  ...rest
}: Proposal<string, string, VoteType, ProposalOption<string>>): Proposal => {
  return {
    ...rest,
    realmPk: new PublicKey(realmPk),
    programPk: new PublicKey(programPk),
    governancePk: new PublicKey(governancePk),
    proposalPk: new PublicKey(proposalPk),
    abstainVoteWeight: abstainVoteWeight
      ? new BN.BN(abstainVoteWeight)
      : undefined,
    denyVoteWeight: denyVoteWeight ? new BN.BN(denyVoteWeight) : undefined,
    maxVoteWeight: maxVoteWeight ? new BN.BN(maxVoteWeight) : undefined,
    vetoVoteWeight: vetoVoteWeight ? new BN.BN(vetoVoteWeight) : undefined,
    governingTokenMintPk: new PublicKey(governingTokenMintPk),
    tokenOwnerRecordPk: new PublicKey(tokenOwnerRecordPk),
    voteThreshold: voteThreshold ? new VoteThreshold(voteThreshold) : undefined,
    yesVoteOption: yesVoteOption
      ? new SolanaProposalOption({
          ...yesVoteOption,
          voteWeight: new BN.BN(yesVoteOption.voteWeight),
        })
      : undefined,
    yesVoteCount: new BN.BN(yesVoteCount),
    noVoteCount: new BN.BN(noVoteCount),
    options: options
      ? options.map<SolanaProposalOption>(
          ({ voteWeight, ...optionRest }) =>
            new SolanaProposalOption({
              ...optionRest,
              voteWeight: new BN.BN(voteWeight),
            }),
        )
      : undefined,
    votingAtSlot: votingAtSlot ? new BN.BN(votingAtSlot) : undefined,
    voteType: voteType
      ? new SolanaVoteType({
          choiceCount: voteType.choiceCount,
          type: voteType.type,
        })
      : undefined,
    draftAt: new Date(draftAt),
    closedAt: closedAt ? new Date(closedAt) : undefined,
    votingAt: votingAt ? new Date(votingAt) : undefined,
    stateTimestamp: new Date(stateTimestamp),
    signingOffAt: signingOffAt ? new Date(signingOffAt) : undefined,
    votingCompletedAt: votingCompletedAt
      ? new Date(votingCompletedAt)
      : undefined,
    startVotingAt: startVotingAt ? new Date(startVotingAt) : undefined,
    estimatedVoteCompletionAt: estimatedVoteCompletionAt
      ? new Date(estimatedVoteCompletionAt)
      : undefined,
    executingAt: executingAt ? new Date(executingAt) : undefined,
  };
};
