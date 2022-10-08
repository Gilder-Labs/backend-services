import { Injectable } from '@nestjs/common';
import type { Connection } from '@gilder/utilities';
import { getConnection } from '@gilder/utilities';
import type { Realm, Proposal as DbProposal } from '@gilder/types';
import { PublicKey } from '@solana/web3.js';
import {
  getProposal,
  getAllProposals,
  ProgramAccount,
  Proposal,
  getGovernance,
  ProposalState,
} from '@solana/spl-governance';

@Injectable()
export class ProposalRPCService {
  private readonly connection: Connection;

  constructor() {
    this.connection = getConnection();
  }

  public getProposalFromSolana(pubKey: string, connection?: Connection) {
    return getProposal(connection ?? this.connection, new PublicKey(pubKey));
  }

  public getProposalsFromSolanaByRealm(
    realm: Omit<Realm, 'name'>,
    connection?: Connection,
  ) {
    return getAllProposals(
      connection ?? this.connection,
      new PublicKey(realm.programPk),
      new PublicKey(realm.realmPk),
    ).then((x) => x.flatMap((x) => x));
  }

  public convertSolanaProposalToEntity(
    realm: Pick<Realm, 'programPk' | 'realmPk'>,
    proposals: ProgramAccount<Proposal>[],
  ): Promise<DbProposal[]> {
    return Promise.all(
      proposals.map<Promise<DbProposal>>(async (x) => {
        let estimatedVoteCompletionAt: number | undefined = undefined;

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
          programPk: x.account.governance.toBase58(),
          realmPk: realm.realmPk,
          proposalPk: x.pubkey.toBase58(),
          descriptionLink: x.account.descriptionLink,
          name: x.account.name,
          state: x.account.state,
          draftAt: new Date(x.account.draftAt.toNumber() * 1000),
          startVotingAt:
            (x.account.startVotingAt &&
              new Date(x.account.startVotingAt.toNumber() * 1000)) ??
            undefined,
          signingOffAt:
            (x.account.signingOffAt &&
              new Date(x.account.signingOffAt.toNumber() * 1000)) ??
            undefined,
          votingCompletedAt:
            (x.account.votingCompletedAt &&
              new Date(x.account.votingCompletedAt.toNumber() * 1000)) ??
            undefined,
          votingAt:
            (x.account.votingAt &&
              new Date(x.account.votingAt.toNumber() * 1000)) ??
            undefined,
          estimatedVoteCompletionAt: estimatedVoteCompletionAt
            ? new Date(estimatedVoteCompletionAt * 1000)
            : undefined,
          closedAt:
            (x.account.closedAt &&
              new Date(x.account.closedAt.toNumber() * 1000)) ??
            undefined,
          executingAt:
            (x.account.executingAt &&
              new Date(x.account.executingAt.toNumber() * 1000)) ??
            undefined,
        };
      }),
    );
  }
}
