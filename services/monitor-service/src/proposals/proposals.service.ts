import { Proposal, Realm } from '@gilder/db-entities';
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  getAllProposals,
  getGovernance,
  getProposal,
  ProgramAccount,
  Proposal as SolanaProposal,
  ProposalState,
} from '@solana/spl-governance';
import { Connection, PublicKey } from '@solana/web3.js';
import { getConnection } from 'src/utils';
import { InsertResult, Repository } from 'typeorm';
import { sort } from 'fast-sort';

@Injectable()
export class ProposalService {
  private readonly logger = new Logger(ProposalService.name);
  private readonly connection: Connection;

  constructor(
    @InjectRepository(Proposal)
    private readonly proposalRepo: Repository<Proposal>,
  ) {
    this.connection = getConnection();
  }

  public getProposalFromSolana(pubKey: string) {
    return getProposal(this.connection, new PublicKey(pubKey));
  }

  public getProposalsFromSolanaByRealm(realm: Realm) {
    return getAllProposals(
      this.connection,
      new PublicKey(realm.governance),
      new PublicKey(realm.pubkey),
    ).then((x) => x.flatMap((x) => x));
  }

  public async foundNewProposals(
    realm: Realm,
    proposals: ProgramAccount<SolanaProposal>[],
  ): Promise<{
    found: boolean;
    newProposals: ProgramAccount<SolanaProposal>[];
  }> {
    const mostRecentProposal = await this.proposalRepo.findOne({
      where: { realmPubKey: realm.pubkey },
      order: { draftAt: 'DESC' },
    });

    const sortedProposals = sort(proposals).desc((x) =>
      x.account.draftAt.toNumber(),
    );

    const timestamp = Math.floor(mostRecentProposal.draftAt.getTime() / 1000);
    const newerProposals = sortedProposals.filter(
      (x) => x.account.draftAt.toNumber() > timestamp,
    );
    return { found: newerProposals.length > 0, newProposals: newerProposals };
  }

  public async addOrUpdateProposals(
    realm: Realm,
    proposals: ProgramAccount<SolanaProposal>[],
  ): Promise<InsertResult> {
    const dbProposals = await this.convertSolanaProposalToEntity(
      realm,
      proposals,
    );
    return this.proposalRepo
      .createQueryBuilder()
      .insert()
      .into(Proposal)
      .values(dbProposals)
      .orUpdate(
        [
          'descriptionLink',
          'name',
          'state',
          'draftAt',
          'startVotingAt',
          'signingOffAt',
          'votingCompletedAt',
          'estimatedVoteCompletionAt',
          'votingAt',
          'closedAt',
          'executingAt',
        ],
        ['pubkey'],
        {
          skipUpdateIfNoValuesChanged: true,
        },
      )
      .execute();
  }

  private convertSolanaProposalToEntity(
    realm: Realm,
    proposals: ProgramAccount<SolanaProposal>[],
  ) {
    return Promise.all(
      proposals.map<Promise<Partial<Proposal>>>(async (x) => {
        let estimatedVoteCompletionAt: number | null = null;

        if (x.account.state === ProposalState.Voting) {
          const governance = await getGovernance(
            this.connection,
            new PublicKey(x.account.governance),
          );

          if (x.account.votingAt) {
            estimatedVoteCompletionAt =
              x.account.votingAt.toNumber() +
              x.account.getTimeToVoteEnd(governance.account);
          }
        }

        return {
          governanceKey: x.account.governance.toBase58(),
          realmPubKey: realm.pubkey,
          pubkey: x.pubkey.toBase58(),
          descriptionLink: x.account.descriptionLink,
          name: x.account.name,
          state: x.account.state,
          draftAt: new Date(x.account.draftAt.toNumber() * 1000),
          startVotingAt:
            x.account.startVotingAt &&
            new Date(x.account.startVotingAt.toNumber() * 1000),
          signingOffAt:
            x.account.signingOffAt &&
            new Date(x.account.signingOffAt.toNumber() * 1000),
          votingCompletedAt:
            x.account.votingCompletedAt &&
            new Date(x.account.votingCompletedAt.toNumber() * 1000),
          votingAt:
            x.account.votingAt &&
            new Date(x.account.votingAt.toNumber() * 1000),
          estimatedVoteCompletionAt:
            estimatedVoteCompletionAt &&
            new Date(estimatedVoteCompletionAt * 1000),
          closedAt:
            x.account.closedAt &&
            new Date(x.account.closedAt.toNumber() * 1000),
          executingAt:
            x.account.executingAt &&
            new Date(x.account.executingAt.toNumber() * 1000),
        };
      }),
    );
  }
}
