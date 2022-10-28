import { PublicKey } from '@solana/web3.js';
import BN from 'bn.js';
import { beforeAll, describe, expect, it } from 'vitest';
import { ApiClient, getTokenOwnersByRealm, createClient } from '../../../src';

const realmPk = '6jydyMWSqV2bFHjCHydEQxa9XfXQWDwjVqAdjBEA1BXx';

describe('Token Owners Query', () => {
  let client: ApiClient;

  beforeAll(() => {
    client = createClient({ uri: 'http:localhost:4000/graphql' });
  });

  it('Test transform func', async () => {
    const tokenOwners = await getTokenOwnersByRealm(
      new PublicKey(realmPk),
      client,
    );
    expect(tokenOwners.length).greaterThan(0);

    expect(tokenOwners[0].ownerPk).toBeInstanceOf(PublicKey);
    expect(tokenOwners[0].governingTokenDespositAmount).toBeInstanceOf(BN);
  });
});
