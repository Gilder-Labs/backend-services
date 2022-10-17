import gql from 'graphql-tag';

const CORE_PROPOSAL_FIELDS = gql`
  fragment CoreProposalFields on Proposal {
    proposalPk
    state
    name
  }
`;

export const GET_ALL_PROPOSALS = gql`
  ${CORE_PROPOSAL_FIELDS}
  query GetProposals {
    proposals {
      ...CoreProposalFields
    }
  }
`;

export { CORE_PROPOSAL_FIELDS, CORE_PROPOSAL_FIELDS };
