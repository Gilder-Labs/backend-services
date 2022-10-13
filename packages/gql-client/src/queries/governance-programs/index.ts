import { gql } from '@apollo/client';

export const GET_ALL_GOVERNANCE_PROGRAMS = gql`
  query GetAllGovernancePrograms {
    governancePrograms
  }
`;
