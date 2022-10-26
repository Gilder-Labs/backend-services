import {
  Realm,
  Proposal,
  TokenOwner,
  Governance,
  SignatoryRecord,
  ProposalTransaction,
  VoteRecord,
} from '@gilder/gov-db-entities';
import { GovServiceModule } from '@gilder/gov-service-module';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SeedController } from './seed.controller';
import { SeedService } from './seed.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Realm,
      Proposal,
      TokenOwner,
      Governance,
      SignatoryRecord,
      ProposalTransaction,
      VoteRecord,
    ]),
    GovServiceModule,
  ],
  controllers: [SeedController],
  providers: [SeedService],
})
export class SeedModule {}
