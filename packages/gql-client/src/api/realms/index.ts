import type { Realm } from '@gilder/types';
import { PublicKey } from '@solana/web3.js';
import {
  GET_ALL_REALMS,
  GET_ALL_REALMS_WITH_PROPOSALS,
  GET_REALM,
  GET_REALM_WITH_PROPOSALS,
} from 'src/queries';
import { transformProposal } from '../proposals/utils';
import { DefaultFetchOptions } from '../types';
import { GetRealmArgs, RealmWithProposals } from './types';
import { transformRealm } from './utils';

const getRealms = async ({ client }: DefaultFetchOptions): Promise<Realm[]> => {
  return client
    .query<Realm<string>[]>({ query: GET_ALL_REALMS })
    .then((r) => r.data.map<Realm>(transformRealm));
};

const getRealmsWithProposals = async ({
  client,
}: DefaultFetchOptions): Promise<RealmWithProposals<PublicKey>[]> => {
  return client
    .query<RealmWithProposals[]>({ query: GET_ALL_REALMS_WITH_PROPOSALS })
    .then((r) =>
      r.data.map<RealmWithProposals<PublicKey>>((x) => ({
        ...transformRealm(x),
        proposals: x.proposals.map(transformProposal),
      })),
    );
};

const getRealm = async ({
  client,
  variables,
}: DefaultFetchOptions<GetRealmArgs>): Promise<Realm> => {
  return client
    .query<Realm<string>>({ query: GET_REALM, variables })
    .then((r) => transformRealm(r.data));
};

const getRealmWithProposals = async ({
  client,
  variables,
}: DefaultFetchOptions<GetRealmArgs>): Promise<
  RealmWithProposals<PublicKey>
> => {
  return client
    .query<RealmWithProposals>({ query: GET_REALM_WITH_PROPOSALS, variables })
    .then((r) => ({
      ...transformRealm(r.data),
      proposals: r.data.proposals.map(transformProposal),
    }));
};

export { getRealms, getRealmsWithProposals, getRealm, getRealmWithProposals };
export * from './types';
