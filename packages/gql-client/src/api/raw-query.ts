import { ApiClient } from 'src/client';
import { getGqlString, QueryOptions } from './utils';

const getRawResults = <TResult extends object>(
  { query, variables }: Pick<QueryOptions, 'query' | 'variables'>,
  client: ApiClient,
) => {
  return client.post<TResult>('/graphql', {
    query: getGqlString(query),
    variables,
  });
};

export { getRawResults };
