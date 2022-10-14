import { DocumentNode } from 'graphql';
import { ApiClient } from 'src/client';

export const getGqlString = (doc: DocumentNode) => {
  return doc.loc && doc.loc.source.body;
};

export type QueryOptions<T = undefined> = {
  query: DocumentNode;
  variables?: T;
};

type ApiReturnType<TResult> = { data: Record<string, TResult> };

export const getResults = async <TResult, TVariables = undefined>(
  { query, variables }: QueryOptions<TVariables>,
  client: ApiClient,
) => {
  const response = await client.post<ApiReturnType<TResult>>('/graphql', {
    query: getGqlString(query),
    variables,
  });
  const result = response.data.data;
  return result[Object.keys(result)[0]];
};
