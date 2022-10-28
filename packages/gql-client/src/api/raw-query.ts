import { ApiClient } from '../client';
import type { QueryOptions } from '../types';

const query = async <TResult = Record<string, any>, TVars = undefined>(
  { query, variables }: QueryOptions<TVars>,
  client: ApiClient,
): Promise<TResult> => {
  const response = await client<TVars, TResult>({
    query,
    variables,
  });
  return response as TResult;
};

export { query };
