import { gql } from '@apollo/client';
import { CORE_PROPOSAL_FIELDS } from '../proposals';

const GET_REALMS = gql`
  query GetRealms {
    realms {
      realmPk
      programPk
      name
    }
  }
`;

const GET_REALMS_WITH_PROPOSALS = gql`
  ${CORE_PROPOSAL_FIELDS}
  query GetRealmsWithProposals {
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
  GET_REALMS,
  GET_REALMS_WITH_PROPOSALS,
  GET_REALM,
  GET_REALM_WITH_PROPOSALS,
};
