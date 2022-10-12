import { ApolloClient } from '@apollo/client';

export type DefaultFetchOptions<T = undefined> = {
  client: ApolloClient<any>;
  variables?: T;
};
