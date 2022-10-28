import { beforeAll, describe, it } from 'vitest';
import type { ApiClient } from '../../../src';
import { createClient, query } from '../../../src';
import gql from 'graphql-tag';

interface CustomQuery {
  programGovernances: { programPk: string }[];
  realmsV1: { name: string }[];
}

describe('Raw Query', () => {
  let client: ApiClient;

  beforeAll(() => {
    client = createClient({ uri: 'http:localhost:4000/graphql' });
  });

  it('test raw query and return type', async () => {
    await query<CustomQuery>(
      {
        query: gql`
          query foo {
            programGovernances {
              programPk
            }
            realmsV1 {
              name
            }
          }
        `,
      },
      client,
    );
  });
});
