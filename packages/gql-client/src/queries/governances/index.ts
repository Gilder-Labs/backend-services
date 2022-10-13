import { gql } from '@apollo/client';

export const CORE_GOVERNANCE_FIELDS = gql`
  fragment CoreGovernanceFields on Governance {
    accountType
    governancePk
    governedAccountPk
    config {
      minCommunityTokensToCreateProposal
      communityVoteTipping
      communityVoteThreshold {
        type
        value
      }
      communityVetoVoteThreshold {
        type
        value
      }
      minCouncilTokensToCreateProposal
      councilVoteTipping
      councilVoteThreshold {
        type
        value
      }
      councilVetoVoteThreshold {
        type
        value
      }
      minInstructionHoldUpTime
      maxVotingTime
    }
    isProgramGovernance
    isTokenGovernance
    isAccountGovernance
    isMintGovernance
  }
`;

export const GET_ALL_GOVERNANCES = gql`
  query GetAllGovernances {
    ${CORE_GOVERNANCE_FIELDS}
    governances {
        ...CoreGovernanceFields
    }
  }
`;
