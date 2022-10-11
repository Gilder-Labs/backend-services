import { Injectable } from '@nestjs/common';
import type { Realm, Proposal as DbProposal } from '@gilder/types';
import { Connection, PublicKey } from '@solana/web3.js';
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
    realm: Omit<Realm, 'name'>,
    connection: Connection,
  ) {
    return getAllProposals(connection, realm.programPk, realm.realmPk).then(
      (x) => x.flatMap((x) => x),
    );
  }

  public convertSolanaProposalToEntity(
    realm: Pick<Realm, 'programPk' | 'realmPk'>,
    proposals: ProgramAccount<Proposal>[],
    connection: Connection,
  ): Promise<DbProposal[]> {
    return Promise.all(
      proposals.map<Promise<DbProposal>>(async (x) => {
        let estimatedVoteCompletionAt: number | undefined = undefined;

        if (x.account.state === ProposalState.Voting) {
          const governance = await getGovernance(
            connection,
            new PublicKey(x.account.governance),
          );

          if (x.account.votingAt) {
            estimatedVoteCompletionAt =
              x.account.votingAt.toNumber() +
              x.account.getTimeToVoteEnd(governance.account);
          }
        }

        return {
          programPk: x.account.governance,
          realmPk: realm.realmPk,
          proposalPk: x.pubkey,
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
