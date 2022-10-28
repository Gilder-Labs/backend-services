import { beforeAll, describe, it } from 'vitest';
import { ApiClient, getAllRealms } from '../../../src';
import { createClient } from '../../../src';

describe('Realm Query', () => {
  let client: ApiClient;

  beforeAll(() => {
    client = createClient({ uri: 'http:localhost:4000/graphql' });
  });

  it('Test transform func', async () => {
    await getAllRealms(client);
  });
});
