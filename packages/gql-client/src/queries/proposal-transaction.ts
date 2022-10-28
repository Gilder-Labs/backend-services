import gql from 'graphql-tag';

const CORE_PROPOSAL_TRANSACTION_FIELDS = gql`
  fragment CoreProposalTransactionFields on ProposalTransaction {
    accountType
    proposalPk
    programPk
    instructionIndex
    instruction {
      programId
      accounts {
        pubkey
        isSigner
        isWritable
      }
    }
    optionIndex
    instructions {
      programId
      accounts {
        pubkey
        isSigner
        isWritable
      }
    }
    holdUpTime
    executedAt
    executionStatus
  }
`;

const GET_ALL_PROPOSAL_TRANSACTIONS = gql`
  ${CORE_PROPOSAL_TRANSACTION_FIELDS}
  query GetAllPropsalTransactions {
    proposalTransactions {
      ...CoreProposalTransactionFields
    }
  }
`;

export { GET_ALL_PROPOSAL_TRANSACTIONS, CORE_PROPOSAL_TRANSACTION_FIELDS };
