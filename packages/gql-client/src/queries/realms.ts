import gql from 'graphql-tag';
import { CORE_PROPOSAL_FIELDS } from './proposals';

const CORE_REALM_FIELDS = gql`
  fragment CoreRealmFields on Realm {
    realmPk
    programPk
    name
  }
`;

const GET_ALL_REALMS = gql`
  ${CORE_REALM_FIELDS}
  query GetAllRealms {
    realms {
      ...CoreRealmFields
    }
  }
`;

const GET_ALL_REALMS_WITH_PROPOSALS = gql`
  ${CORE_REALM_FIELDS}
  ${CORE_PROPOSAL_FIELDS}
  query GetAllRealmsWithProposals {
    realms {
      ...CoreRealmFields
      proposals {
        ...CoreProposalFields
      }
    }
  }
`;

const GET_REALM = gql`
  ${CORE_REALM_FIELDS}
  query GetRealm($name: String, $realmPk: String) {
    getRealm(name: $name, realmPk: $realmPk) {
      ...CoreRealmFields
    }
  }
`;

const GET_REALM_WITH_PROPOSALS = gql`
  ${CORE_REALM_FIELDS}
  ${CORE_PROPOSAL_FIELDS}
  query GetRealmWithProposals($name: String, $realmPk: String) {
    getRealm(name: $name, realmPk: $realmPk) {
      ...CoreRealmFields
      proposals {
        ...CoreProposalFields
      }
    }
  }
`;

export {
  CORE_REALM_FIELDS,
  GET_ALL_REALMS,
  GET_ALL_REALMS_WITH_PROPOSALS,
  GET_REALM,
  GET_REALM_WITH_PROPOSALS,
};
