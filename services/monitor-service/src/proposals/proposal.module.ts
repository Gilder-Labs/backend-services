import { NotificationSubscription, Proposal, Realm } from '@gilder/db-entities';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RealmsModule } from '@gilder/realms-module';
import { ProposalController } from './proposal.controller';
import { ProposalsMonitorService } from './proposals.monitor';
import { ProposalsModule } from '@gilder/proposals-module';
import { BullModule } from '@nestjs/bull';
import { NOTIFICATION_QUEUE, PROPOSAL_QUEUE } from '@gilder/constants';
import { ProposalProcessor } from './proposal.processor';
import { RpcManagerModule } from '@gilder/rpc-manager-module';

@Module({
  imports: [
    RpcManagerModule.register([
      {
        rps: 100,
        uri: 'https://evocative-maximum-grass.solana-mainnet.quiknode.pro/56a0c5c00550838a2d9666ee379415ca076420f8/',
      },
      {
        rps: 25,
        uri: 'https://necessary-winter-county.solana-mainnet.discover.quiknode.pro/7ea512375c985ba68369cc9526c64a88ee27992a/',
      },
    ]),
    TypeOrmModule.forFeature([Realm, Proposal, NotificationSubscription]),
    BullModule.registerQueue(
      {
        name: NOTIFICATION_QUEUE,
      },
      {
        name: PROPOSAL_QUEUE,
      },
    ),
    RealmsModule,
    ProposalsModule,
  ],
  controllers: [ProposalController],
  providers: [ProposalProcessor, ProposalsMonitorService],
})
export class ProposalsMonitorModule {}
