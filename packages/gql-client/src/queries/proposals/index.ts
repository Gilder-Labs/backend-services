import { gql } from '@apollo/client';

const CORE_PROPOSAL_FIELDS = gql`
  fragment CoreProposalFields on Proposal {
    proposalPk
    state
    name
  }
`;

export { CORE_PROPOSAL_FIELDS };
