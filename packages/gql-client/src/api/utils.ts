import { QueryOptions } from '@apollo/client';
import { ApolloClient } from './types';

export const getResults = async <TResult>(
  queryOptions: QueryOptions,
  client: ApolloClient,
) => {
  const result = await client.query<{ [key: string]: TResult }>(queryOptions);
  return result.data[Object.keys(result.data)[0]];
};
