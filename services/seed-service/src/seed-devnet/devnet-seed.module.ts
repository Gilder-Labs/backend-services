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
import { DEVNET_DB } from 'src/utils/constants';
import { DevnetSeedController } from './devnet-seed.controller';
import { DevnetSeedService } from './devnet-seed.service';

@Module({
  imports: [
    GovServiceModule.register(DEVNET_DB),
    TypeOrmModule.forFeature(
      [
        Realm,
        Proposal,
        TokenOwner,
        Governance,
        SignatoryRecord,
        ProposalTransaction,
        VoteRecord,
      ],
      DEVNET_DB,
    ),
  ],
  controllers: [DevnetSeedController],
  providers: [DevnetSeedService],
})
export class DevnetSeedModule {}
