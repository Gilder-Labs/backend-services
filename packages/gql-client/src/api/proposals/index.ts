import { Proposal } from '@gilder/types';
import { ApiClient } from '../../client';
import { GET_ALL_PROPOSALS } from '../../queries/proposals';
import { getResults } from '../utils';
import { transformProposal } from './utils';

const getAllProposals = async (client: ApiClient): Promise<Proposal[]> => {
  return getResults<Proposal<string>[]>(
    { query: GET_ALL_PROPOSALS },
    client,
  ).then((data) => data.map<Proposal>(transformProposal));
};

export { getAllProposals };
