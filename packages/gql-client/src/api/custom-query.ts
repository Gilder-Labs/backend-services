import { QueryOptions } from '@apollo/client';
import { ApolloClient } from './types';

const customQuery = <TResult extends object>(
  { query, variables }: Pick<QueryOptions, 'query' | 'variables'>,
  client: ApolloClient,
) => {
  return client.query<TResult>({ query, variables });
};

export { customQuery };
