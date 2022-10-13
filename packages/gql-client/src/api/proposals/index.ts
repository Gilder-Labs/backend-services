import { Proposal } from '@gilder/types';
import { GET_PROPOSALS } from 'src/queries/proposals';
import { DefaultFetchOptions } from '../types';
import { transformProposal } from './utils';

const getProposals = async ({
  client,
}: DefaultFetchOptions): Promise<Proposal[]> => {
  return client
    .query<Proposal<string>[]>({ query: GET_PROPOSALS })
    .then((r) => r.data.map<Proposal>(transformProposal));
};

export { getProposals };
