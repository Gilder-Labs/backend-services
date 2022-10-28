import { ProposalTransaction } from '@gilder/types';
import { GET_ALL_PROPOSAL_TRANSACTIONS } from '../../queries';
import { ApiClient } from '../../client';
import { getResults } from '../utils';
import { transformProposalTransactions } from './utils';

const getAllProposalTransactions = async (
  client: ApiClient,
): Promise<ProposalTransaction[]> => {
  return getResults<ProposalTransaction<string>[]>(
    { query: GET_ALL_PROPOSAL_TRANSACTIONS },
    client,
  ).then((data) =>
    data.map<ProposalTransaction>(transformProposalTransactions),
  );
};

export { getAllProposalTransactions };
