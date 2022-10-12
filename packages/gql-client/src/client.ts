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
  /** Default: true */
  assumeImmutableResults?: boolean;
  name: string;
};

const createClient = ({
  assumeImmutableResults = true,
  uri = 'https://api.gilder.xyz/graphql',
  name,
}: ClientOptions): ApolloClient<NormalizedCacheObject> => {
  return new ApolloClient({
    cache: new InMemoryCache(),
    link: new HttpLink({ uri, fetch }),
    assumeImmutableResults,
    name,
    version: '0.1',
  });
};

export { createClient };
export type { ClientOptions };
