import { Proposal, VoteType, ProposalOption } from '@gilder/types';
import { PublicKey } from '@solana/web3.js';
import { ApiClient } from '../../client';
import {
  GET_ALL_PROPOSALS,
  GET_PROPOSALS_BY_REALM,
} from '../../queries/proposals';
import { getResults } from '../utils';
import { transformProposal } from './utils';

const getAllProposals = async (client: ApiClient): Promise<Proposal[]> => {
  return getResults<
    Proposal<string, string, VoteType, ProposalOption<string>>[]
  >({ query: GET_ALL_PROPOSALS }, client).then((data) =>
    data.map<Proposal>(transformProposal),
  );
};

const getProposalsByRealm = async (
  realmPk: string | PublicKey,
  client: ApiClient,
): Promise<Proposal[]> => {
  return getResults<
    Proposal<string, string, VoteType, ProposalOption<string>>[],
    { realmPk: string }
  >(
    {
      query: GET_PROPOSALS_BY_REALM,
      variables: { realmPk: realmPk.toString() },
    },
    client,
  ).then((data) => data.map<Proposal>(transformProposal));
};

export { getAllProposals, getProposalsByRealm };
