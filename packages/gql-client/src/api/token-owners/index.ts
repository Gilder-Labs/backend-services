import { TokenOwner } from '@gilder/types';
import { GET_ALL_TOKEN_OWNERS } from 'src/queries/token-owners';
import { ApiClient } from '../../client';
import { getResults } from '../utils';
import { transformTokenOwner } from './utils';

const getAllTokenOwners = async (client: ApiClient): Promise<TokenOwner[]> => {
  return getResults<TokenOwner<string>[]>(
    { query: GET_ALL_TOKEN_OWNERS },
    client,
  ).then((data) => data.map<TokenOwner>(transformTokenOwner));
};

export { getAllTokenOwners };
