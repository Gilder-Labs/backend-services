import gql from 'graphql-tag';

const CORE_TOKEN_OWNERS_FIELDS = gql`
  fragment CoreTokenOwnerFields on TokenOwner {
    ownerPk
    realmPk
    governanceAccountType
    governingTokenMintPk
    governingTokenOwnerPk
    governanceDelegatePk
    governingTokenDespositAmount
    unrelinquishedVotesCount
    totalVotesCount
    outstandingProposalCount
  }
`;

const GET_ALL_TOKEN_OWNERS = gql`
  ${CORE_TOKEN_OWNERS_FIELDS}
  query GetTokenOwners {
    ...CoreTokenOwnerFields
  }
`;

export { GET_ALL_TOKEN_OWNERS, CORE_TOKEN_OWNERS_FIELDS };
