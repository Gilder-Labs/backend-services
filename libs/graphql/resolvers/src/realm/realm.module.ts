import { Module } from '@nestjs/common';
import { RealmsResolver } from './realm.resolver';
import { RealmsModule, RealmsService } from '@gilder/realms-module';
import { Proposal, Realm, TokenOwner } from '@gilder/db-entities';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TokenOwnersServiceModule } from '@gilder/token-owners-module';
import { ProposalsModule } from '@gilder/proposals-module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Realm, Proposal, TokenOwner]),
    TokenOwnersServiceModule,
    ProposalsModule,
    RealmsModule,
  ],
  providers: [RealmsService, RealmsResolver],
  exports: [RealmsResolver],
})
export class RealmsGraphQLModule {}
