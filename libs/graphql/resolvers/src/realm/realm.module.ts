import { Module } from '@nestjs/common';
import { RealmsResolver } from './realm.resolver';
import { RealmsModule, RealmsService } from '@gilder/realms-module';
import { Realm } from '@gilder/db-entities';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Realm]), RealmsModule],
  providers: [RealmsService, RealmsResolver],
  exports: [RealmsResolver],
})
export class RealmsGraphQLModule {}
