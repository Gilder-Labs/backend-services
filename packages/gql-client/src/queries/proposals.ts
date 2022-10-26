import gql from 'graphql-tag';

const CORE_PROPOSAL_FIELDS = gql`
  fragment CoreProposalFields on Proposal {
    governancePk
    realmPk
    proposalPk
    state
    name
    descriptionLink
    draftAt
    startVotingAt
    votingCompletedAt
    estimatedVoteCompletionAt
    closedAt
    executingAt
    signingOffAt
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

export { CORE_PROPOSAL_FIELDS, GET_ALL_PROPOSALS };
