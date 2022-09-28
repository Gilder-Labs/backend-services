import { Proposal } from '@gilder/db-entities';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProposalsService } from './proposals.service';

@Module({
  imports: [TypeOrmModule.forFeature([Proposal])],
  providers: [ProposalsService],
  exports: [ProposalsService],
})
export class ProposalsModule {}
