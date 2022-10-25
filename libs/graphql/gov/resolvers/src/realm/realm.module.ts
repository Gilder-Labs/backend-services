import { Module } from '@nestjs/common';
import { RealmsResolver } from './realm.resolver';
import { Proposal, Realm, TokenOwner } from '@gilder/gov-db-entities';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataLoaderModule } from '@gilder/graphql-gov-dataloaders';
import { GovServiceModule } from '@gilder/gov-service-module';

@Module({
  imports: [
    GovServiceModule,
    TypeOrmModule.forFeature([Realm, Proposal, TokenOwner]),
    DataLoaderModule,
  ],
  providers: [RealmsResolver],
  exports: [RealmsResolver],
})
export class RealmsGraphQLModule {}
