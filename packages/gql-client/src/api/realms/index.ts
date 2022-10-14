import type { Realm } from '@gilderlabs/types';
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

const getAllRealms = async (client: ApiClient): Promise<Realm[]> => {
  return getResults<Realm<string>[]>({ query: GET_ALL_REALMS }, client).then(
    (data) => data.map<Realm>(transformRealm),
  );
};

const getAllRealmsWithProposals = async (
  client: ApiClient,
): Promise<RealmWithProposals[]> => {
  return getResults<RealmWithProposals<string>[]>(
    {
      query: GET_ALL_REALMS_WITH_PROPOSALS,
    },
    client,
  ).then((data) =>
    data.map<RealmWithProposals>((x) => ({
      ...transformRealm(x),
      proposals: x.proposals.map(transformProposal),
    })),
  );
};

const getRealm = async (
  variables: GetRealmArgs,
  client: ApiClient,
): Promise<Realm> => {
  return getResults<Realm<string>, GetRealmArgs>(
    { query: GET_REALM, variables },
    client,
  ).then((data) => transformRealm(data));
};

const getRealmWithProposals = async (
  variables: GetRealmArgs,
  client: ApiClient,
): Promise<RealmWithProposals> => {
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
