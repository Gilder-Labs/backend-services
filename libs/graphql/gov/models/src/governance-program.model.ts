import { Field, ObjectType } from '@nestjs/graphql';
import { Governance } from './governance.model';
import { ProposalTransaction } from './proposal-transaction.model';
import { Proposal } from './proposal.model';
import { Realm } from './realm.model';
import { SignatoryRecord } from './signatory-record.model';
import { TokenOwner } from './token-owner.model';
import { VoteRecord } from './vote-record.model';

@ObjectType()
export class GovernanceProgram {
  @Field()
  governanceProgramPk: string;

  @Field(() => [Realm], { nullable: true })
  realms?: Realm[];

  @Field(() => [Proposal], { nullable: true })
  proposals?: Proposal[];

  @Field(() => [Governance], { nullable: true })
  governances?: Governance[];

  @Field(() => [ProposalTransaction], { nullable: true })
  proposalTransactions?: ProposalTransaction[];

  @Field(() => [TokenOwner], { nullable: true })
  tokenOwners?: TokenOwner[];

  @Field(() => [SignatoryRecord], { nullable: true })
  signatoryRecords?: SignatoryRecord[];

  @Field(() => [VoteRecord], { nullable: true })
  voteRecords?: VoteRecord[];
}
