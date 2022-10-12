import type { Realm } from '@gilder/types';
import { PublicKey } from '@solana/web3.js';
import { GET_REALMS, GET_REALMS_WITH_PROPOSALS } from 'src/queries';
import { transformProposal } from '../proposals/utils';
import { DefaultFetchOptions } from '../types';
import { RealmWithProposals } from './types';
import { transformRealm } from './utils';

const getRealms = async ({ client }: DefaultFetchOptions): Promise<Realm[]> => {
  return client
    .query<Realm<string>[]>({ query: GET_REALMS })
    .then((r) => r.data.map<Realm>(transformRealm));
};

const getRealmsWithProposals = async ({
  client,
}: DefaultFetchOptions): Promise<RealmWithProposals<PublicKey>[]> => {
  return client
    .query<RealmWithProposals[]>({ query: GET_REALMS_WITH_PROPOSALS })
    .then((r) =>
      r.data.map<RealmWithProposals<PublicKey>>((x) => ({
        ...transformRealm(x),
        proposals: x.proposals.map(transformProposal),
      })),
    );
};

export { getRealms, getRealmsWithProposals };
export * from './types';
