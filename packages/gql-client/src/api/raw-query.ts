import { ApiClient } from '../client';
import type { QueryOptions } from '../types';

const getRawResults = <TVars = undefined, TResult = any>(
  { query, variables }: QueryOptions<TVars>,
  client: ApiClient,
) => {
  return client<TVars, TResult>({
    query,
    variables,
  });
};

export { getRawResults };
