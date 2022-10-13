import { gql } from '@apollo/client';

const CORE_PROPOSAL_FIELDS = gql`
  fragment CoreProposalFields on Proposal {
    proposalPk
    state
    name
  }
`;

export const GET_PROPOSALS = gql`
  ${CORE_PROPOSAL_FIELDS}
  query GetProposals {
    proposals {
      ...CoreProposalFields
    }
  }
`;

export { CORE_PROPOSAL_FIELDS };
