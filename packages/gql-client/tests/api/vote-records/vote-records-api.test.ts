import { PublicKey } from '@solana/web3.js';
import BN from 'bn.js';
import { beforeAll, describe, expect, it } from 'vitest';
import { ApiClient, createClient, getAllVoteRecords } from '../../../src';

describe('Vote Records Query', () => {
  let client: ApiClient;

  beforeAll(() => {
    client = createClient({ uri: 'http:localhost:4000/graphql' });
  });

  it('Test transform func', async () => {
    const voteRecords = await getAllVoteRecords(client);
    expect(voteRecords.length).greaterThan(0);

    expect(voteRecords[0].proposalPk).toBeInstanceOf(PublicKey);
    expect(voteRecords[0].yesVoteWeight).toBeInstanceOf(BN);
  });
});
