import { Injectable } from '@nestjs/common';
import { Connection, PublicKey } from '@solana/web3.js';
import { Proposal as DbProposal } from '@gilder/gov-db-entities';
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
  constructor() {}

  public getProposalFromSolana(pubKey: string, connection: Connection) {
    return getProposal(connection, new PublicKey(pubKey));
  }

  public getProposalsFromSolanaByRealm(
    realm: { realmPk: string; programPk: string },
    connection: Connection,
  ) {
    return getAllProposals(
      connection,
      new PublicKey(realm.programPk),
      new PublicKey(realm.realmPk),
    ).then((x) => x.flatMap((x) => x));
  }

  public convertSolanaProposalToEntity(
    realm: { realmPk: string; programPk: string },
    proposals: ProgramAccount<Proposal>[],
    connection: Connection,
  ): Promise<Omit<DbProposal, 'created_at' | 'updated_at'>[]> {
    return Promise.all(
      proposals.map<Promise<Omit<DbProposal, 'created_at' | 'updated_at'>>>(
        async (x) => {
          let estimatedVoteCompletionAt: number | undefined = undefined;

          if (x.account.state === ProposalState.Voting) {
            const governance = await getGovernance(
              connection,
              x.account.governance,
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
        },
      ),
    );
  }
}
