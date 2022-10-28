import gql from 'graphql-tag';

const CORE_GOVERNANCE_FIELDS = gql`
  fragment CoreGovernanceFields on Governance {
    programPk
    governancePk
    accountType
    realmPk
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
    proposalCount
    votingProposalCount
    isProgramGovernance
    isTokenGovernance
    isAccountGovernance
    isMintGovernance
  }
`;

const GET_ALL_GOVERNANCES = gql`
  query GetAllGovernances {
    ${CORE_GOVERNANCE_FIELDS}
    governances {
        ...CoreGovernanceFields
    }
  }
`;

export { CORE_GOVERNANCE_FIELDS, GET_ALL_GOVERNANCES };
