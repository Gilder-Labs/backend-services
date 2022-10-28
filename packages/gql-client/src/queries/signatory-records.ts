import gql from 'graphql-tag';

const CORE_SIGNATORY_RECORD_FIELDS = gql`
  fragment CoreSignatoryRecordFields on SignatoryRecord {
    accountType
    proposalPk
    programPk
    signatoryPk
    signedOff
  }
`;

const GET_ALL_SIGNATORY_RECORDS = gql`
  ${CORE_SIGNATORY_RECORD_FIELDS}
  query GetAllSignatoryRecords {
    signatoryRecords {
      ...CoreSignatoryRecordFields
    }
  }
`;

export { GET_ALL_SIGNATORY_RECORDS, CORE_SIGNATORY_RECORD_FIELDS };
