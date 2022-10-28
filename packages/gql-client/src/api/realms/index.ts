import type { RawMintMaxVoteWeightSource, Realm } from '@gilder/types';
import { PublicKey } from '@solana/web3.js';
import { DocumentNode } from 'graphql';
import { ApiClient } from '../../client';
import {
  GET_ALL_REALMS,
  GET_ALL_REALMS_WITH_PROPOSALS,
  GET_REALM,
  GET_REALM_WITH_PROPOSALS,
} from '../../queries';
import { transformProposal } from '../proposals/utils';
import { getResults } from '../utils';
import { GetRealmArgs, RealmWithProposals } from './types';
import { transformRealm } from './utils';

const getAllRealms = async (client: ApiClient) => {
  return getResults<
    Realm<string, string, RawMintMaxVoteWeightSource<string>>[]
  >({ query: GET_ALL_REALMS }, client).then((data) => data.map(transformRealm));
};

const getAllRealmsWithProposals = async (client: ApiClient) => {
  return getResults<RealmWithProposals<string>[]>(
    {
      query: GET_ALL_REALMS_WITH_PROPOSALS,
    },
    client,
  ).then((data) =>
    data.map((x) => ({
      ...transformRealm(x),
      proposals: x.proposals.map(transformProposal),
    })),
  );
};

const getRealm = async (variables: GetRealmArgs, client: ApiClient) => {
  return getResults<Realm<string>, GetRealmArgs>(
    { query: GET_REALM, variables },
    client,
  ).then((data) => transformRealm(data));
};

const getRealmWithProposals = async (
  variables: GetRealmArgs,
  client: ApiClient,
) => {
  return getResults<RealmWithProposals<string>, GetRealmArgs>(
    { query: GET_REALM_WITH_PROPOSALS, variables },
    client,
  ).then((data) => ({
    ...transformRealm(data),
    proposals: data.proposals.map(transformProposal),
  }));
};

export {
  getAllRealms,
  getAllRealmsWithProposals,
  getRealm,
  getRealmWithProposals,
};
export * from './types';
