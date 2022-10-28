import gql from 'graphql-tag';

const CORE_VOTE_RECORD_FIELDS = gql`
  fragment CoreVoteRecordFields on VoteRecord {
    accountType
    proposalPk
    programPk
    governingTokenOwnerPk
    isRelinquished
    voteWeight {
      yes
      no
    }
    voterWeight
    vote {
      voteType
      approveChoices {
        rank
        weightPercentage
      }
      deny
      veto
    }
    noVoteWeight
    yesVoteWeight
  }
`;

const GET_ALL_VOTE_RECORDS = gql`
  ${CORE_VOTE_RECORD_FIELDS}
  query GetAllVoteRecords {
    voteRecords {
      ...CoreVoteRecordFields
    }
  }
`;

export { GET_ALL_VOTE_RECORDS, CORE_VOTE_RECORD_FIELDS };
