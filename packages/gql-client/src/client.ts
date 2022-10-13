import {
  ApolloClient,
  HttpLink,
  InMemoryCache,
  NormalizedCacheObject,
} from '@apollo/client';
import fetch from 'cross-fetch';

type ClientOptions = {
  /** Default: https://api.gilder.xyz/graphql */
  uri?: string;
};

const createClient = (
  { uri }: ClientOptions = { uri: 'https://api.gilder.xyz/graphql' },
): ApolloClient<NormalizedCacheObject> => {
  return new ApolloClient({
    cache: new InMemoryCache(),
    link: new HttpLink({ uri, fetch }),
  });
};

export { createClient };
export type { ClientOptions };
