import { TokenOwner } from '@gilder/types';
import {
  GET_ALL_TOKEN_OWNERS,
  GET_TOKEN_OWNERS_BY_REALM,
} from '../../queries/token-owners';
import { ApiClient } from '../../client';
import { getResults } from '../utils';
import { transformTokenOwner } from './utils';
import { PublicKey } from '@solana/web3.js';

const getAllTokenOwners = async (client: ApiClient): Promise<TokenOwner[]> => {
  return getResults<TokenOwner<string, string>[]>(
    { query: GET_ALL_TOKEN_OWNERS },
    client,
  ).then((data) => data.map<TokenOwner>(transformTokenOwner));
};

const getTokenOwnersByRealm = async (
  realmPk: string | PublicKey,
  client: ApiClient,
): Promise<TokenOwner[]> => {
  return getResults<TokenOwner<string, string>[], { realmPk: string }>(
    {
      query: GET_TOKEN_OWNERS_BY_REALM,
      variables: { realmPk: realmPk.toString() },
    },
    client,
  ).then((data) => data.map<TokenOwner>(transformTokenOwner));
};

export { getAllTokenOwners, getTokenOwnersByRealm };
