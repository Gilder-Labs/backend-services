import { Module } from '@nestjs/common';
import { TokenOwnersResolver } from './token-owners.resolver';
import { TokenOwnersServiceModule } from '@gilder/token-owners-module';
import { TokenOwner } from '@gilder/db-entities';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([TokenOwner]), TokenOwnersServiceModule],
  providers: [TokenOwnersResolver],
  exports: [TokenOwnersResolver],
})
export class TokenOwnersGraphQLModule {}
