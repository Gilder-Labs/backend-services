import { Proposal } from '@gilder/types';
import { GET_ALL_PROPOSALS } from '../../queries/proposals';
import { ApolloClient } from '../types';
import { getResults } from '../utils';
import { transformProposal } from './utils';

const getAllProposals = async (client: ApolloClient): Promise<Proposal[]> => {
  return getResults<Proposal<string>[]>(
    { query: GET_ALL_PROPOSALS },
    client,
  ).then((data) => data.map<Proposal>(transformProposal));
};

export { getAllProposals };
