import { ProposalOption } from '@solana/spl-governance';
import { PublicKey } from '@solana/web3.js';
import BN from 'bn.js';
import { beforeAll, describe, expect, it } from 'vitest';
import type { ApiClient } from '../../../src';
import { createClient, getProposalsByRealm } from '../../../src';

const realmPk = '6jydyMWSqV2bFHjCHydEQxa9XfXQWDwjVqAdjBEA1BXx';

describe('Proposal Query', () => {
  let client: ApiClient;

  beforeAll(() => {
    client = createClient({ uri: 'http:localhost:4000/graphql' });
  });

  it('Test transform func', async () => {
    const proposals = await getProposalsByRealm(realmPk, client);
    expect(proposals.length).greaterThan(0);

    expect(proposals[0].programPk).toBeInstanceOf(PublicKey);
    expect(proposals[0].draftAt).toBeInstanceOf(Date);
    expect(proposals[0].yesVoteOption).toBeInstanceOf(ProposalOption);
    expect(proposals[0].yesVoteCount).toBeInstanceOf(BN);
  });
});
