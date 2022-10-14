import fetch from 'cross-fetch';
import { QueryOptions } from './types';
import { getGqlString } from './utils';

type ClientOptions = {
  /** Default: https://api.gilder.xyz/graphql */
  uri?: string;
};

type ApiReturnType<TResult> = { data: Record<string, TResult> };

const createClient = (
  { uri }: ClientOptions = { uri: 'https://api.gilder.xyz/graphql' },
) => {
  return <TVars = undefined, TResult = any>({
    query,
    variables = undefined,
  }: QueryOptions<TVars>) => {
    return fetch(uri!, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        query: getGqlString(query),
        variables: variables,
      }),
    })
      .then((res) => res.json())
      .then((data: ApiReturnType<TResult>) => data.data);
  };
};

type ApiClient = ReturnType<typeof createClient>;

export { createClient };
export type { ClientOptions, ApiClient };
