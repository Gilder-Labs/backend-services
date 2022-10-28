import gql from 'graphql-tag';

const CORE_OPTION_FIELDS = gql`
  fragment CoreOptionFields on ProposalOption {
    label
    voteWeight
    voteResult
    instructionsExecutedCount
    instructionsCount
    instructionsNextIndex
  }
`;

const CORE_PROPOSAL_FIELDS = gql`
  ${CORE_OPTION_FIELDS}
  fragment CoreProposalFields on Proposal {
    accountType
    governingTokenMintPk
    governancePk
    proposalPk
    programPk
    realmPk
    name
    tokenOwnerRecordPk
    signatoriesCount
    signatoriesSignedOffCount
    instructionsExecutedCount
    instructionsCount
    instructionsNextIndex
    voteType {
      type
      choiceCount
    }
    options {
      ...CoreOptionFields
    }
    denyVoteWeight
    abstainVoteWeight
    maxVotingTime
    votingAtSlot
    votingAtSlot
    executionFlags
    maxVoteWeight
    voteThreshold {
      type
      value
    }
    vetoVoteWeight
    isVoteFinalized
    isFinalState
    stateTimestamp
    stateSortRank
    isPreVotingState
    yesVoteOption {
      ...CoreOptionFields
    }
    yesVoteCount
    noVoteCount
    timeToVoteEnd
    voteTimeEnded
    state
    descriptionLink
    draftAt
    signingOffAt
    startVotingAt
    votingCompletedAt
    votingAt
    estimatedVoteCompletionAt
    closedAt
    executingAt
  }
`;

const GET_ALL_PROPOSALS = gql`
  ${CORE_PROPOSAL_FIELDS}
  query GetProposals {
    proposals {
      ...CoreProposalFields
    }
  }
`;

const GET_PROPOSALS_BY_REALM = gql`
  ${CORE_PROPOSAL_FIELDS}
  query GetProposals($realmPk: String!) {
    getProposalsByRealm(realmPk: $realmPk) {
      ...CoreProposalFields
    }
  }
`;

export {
  CORE_OPTION_FIELDS,
  CORE_PROPOSAL_FIELDS,
  GET_ALL_PROPOSALS,
  GET_PROPOSALS_BY_REALM,
};
