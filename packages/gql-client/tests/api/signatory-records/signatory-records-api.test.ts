import { PublicKey } from '@solana/web3.js';
import BN from 'bn.js';
import { beforeAll, describe, expect, it } from 'vitest';
import { ApiClient, getAllSignatoryRecords, createClient } from '../../../src';

describe('Signatory Records Query', () => {
  let client: ApiClient;

  beforeAll(() => {
    client = createClient({ uri: 'http:localhost:4000/graphql' });
  });

  it('Test transform func', async () => {
    const signatoryRecords = await getAllSignatoryRecords(client);
    expect(signatoryRecords.length).greaterThan(0);

    expect(signatoryRecords[0].programPk).toBeInstanceOf(PublicKey);
  });
});
