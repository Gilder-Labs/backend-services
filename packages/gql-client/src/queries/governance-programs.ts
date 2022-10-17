import gql from 'graphql-tag';

export const GET_ALL_GOVERNANCE_PROGRAMS = gql`
  query GetAllGovernancePrograms {
    governancePrograms
  }
`;
