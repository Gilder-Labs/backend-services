import axios from 'axios';

type ClientOptions = {
  /** Default: https://api.gilder.xyz/graphql */
  uri?: string;
};

const createClient = (
  { uri }: ClientOptions = { uri: 'https://api.gilder.xyz' },
) => {
  const client = axios.create({
    baseURL: uri,
  });
  return client;
};

type ApiClient = ReturnType<typeof createClient>;

export { createClient };
export type { ClientOptions, ApiClient };
