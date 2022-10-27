import gql from 'graphql-tag';

export const GET_ALL_GOVERNANCE_PROGRAM_PKS = gql`
  query GetAllGovernancePrograms {
    governancePrograms {
      governanceProgramPk
    }
  }
`;
