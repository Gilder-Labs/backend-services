import { Module } from '@nestjs/common';
import { RealmsResolver } from './realm.resolver';
import { RealmsModule } from '@gilder/realms-module';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [RealmsModule],
  providers: [RealmsResolver],
  exports: [RealmsResolver],
})
export class RealmsGraphQLModule {}
