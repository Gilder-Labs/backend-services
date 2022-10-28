import { PublicKey } from '@solana/web3.js';
import { beforeAll, describe, expect, it } from 'vitest';
import {
  ApiClient,
  createClient,
  getAllProposalTransactions,
} from '../../../src';

describe('Proposal Transactions Query', () => {
  let client: ApiClient;

  beforeAll(() => {
    client = createClient({ uri: 'http:localhost:4000/graphql' });
  });

  it('Test transform func', async () => {
    const proposalTransactions = await getAllProposalTransactions(client);
    expect(proposalTransactions.length).greaterThan(0);
    expect(proposalTransactions[0].proposalPk).toBeInstanceOf(PublicKey);
  });
});
