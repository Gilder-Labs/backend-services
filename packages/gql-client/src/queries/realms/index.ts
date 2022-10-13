import { gql } from '@apollo/client';
import { CORE_PROPOSAL_FIELDS } from '../proposals';

const GET_ALL_REALMS = gql`
  query GetAllRealms {
    realms {
      realmPk
      programPk
      name
    }
  }
`;

const GET_ALL_REALMS_WITH_PROPOSALS = gql`
  ${CORE_PROPOSAL_FIELDS}
  query GetAllRealmsWithProposals {
    realms {
      realmPk
      programPk
      name
      proposals {
        ...CoreProposalFields
      }
    }
  }
`;

const GET_REALM = gql`
  query GetRealm($name: String, $realmPk: String) {
    getRealm(name: $name, realmPk: $realmPk) {
      realmPk
      programPk
      name
    }
  }
`;

const GET_REALM_WITH_PROPOSALS = gql`
  ${CORE_PROPOSAL_FIELDS}
  query GetRealmWithProposals($name: String, $realmPk: String) {
    getRealm(name: $name, realmPk: $realmPk) {
      realmPk
      programPk
      name
      proposals {
        ...CoreProposalFields
      }
    }
  }
`;

export {
  GET_ALL_REALMS,
  GET_ALL_REALMS_WITH_PROPOSALS,
  GET_REALM,
  GET_REALM_WITH_PROPOSALS,
};
