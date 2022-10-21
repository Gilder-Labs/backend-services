import { ApiClient } from '../client';
import type { QueryOptions } from '../types';

export const getResults = async <TResult, TVariables = undefined>(
  { query, variables }: QueryOptions<TVariables>,
  client: ApiClient,
) => {
  const response = await client<TVariables, TResult>({
    query,
    variables,
  });
  return response[Object.keys(response)[0]];
};
