import { Module } from '@nestjs/common';
import { TokenOwnersResolver } from './token-owners.resolver';
import { TokenOwner } from '@gilder/gov-db-entities';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TokenOwnersServiceModule } from '@gilder/gov-service-module';

@Module({
  imports: [TypeOrmModule.forFeature([TokenOwner]), TokenOwnersServiceModule],
  providers: [TokenOwnersResolver],
  exports: [TokenOwnersResolver],
})
export class TokenOwnersGraphQLModule {}
