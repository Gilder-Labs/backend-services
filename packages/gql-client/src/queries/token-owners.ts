import gql from 'graphql-tag';

const CORE_TOKEN_OWNERS_FIELDS = gql`
  fragment CoreTokenOwnerFields on TokenOwner {
    accountType
    programPk
    ownerPk
    realmPk
    governingTokenMintPk
    governingTokenOwnerPk
    governingTokenDespositAmount
    unrelinquishedVotesCount
    totalVotesCount
    outstandingProposalCount
    governanceDelegatePk
  }
`;

const GET_ALL_TOKEN_OWNERS = gql`
  ${CORE_TOKEN_OWNERS_FIELDS}
  query GetTokenOwners {
    tokenOwners {
      ...CoreTokenOwnerFields
    }
  }
`;

const GET_TOKEN_OWNERS_BY_REALM = gql`
  ${CORE_TOKEN_OWNERS_FIELDS}
  query GetTokenOwners($realmPk: String!) {
    getTokenOwnersByRealm(realmPk: $realmPk) {
      ...CoreTokenOwnerFields
    }
  }
`;

export {
  GET_ALL_TOKEN_OWNERS,
  CORE_TOKEN_OWNERS_FIELDS,
  GET_TOKEN_OWNERS_BY_REALM,
};
