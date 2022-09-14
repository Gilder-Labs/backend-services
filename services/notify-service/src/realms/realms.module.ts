import { Realm } from '@gilder/db-entities';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { RealmsController } from './realms.controller';
import { RealmSubscriber } from './realms.subscriber';

@Module({
  imports: [TypeOrmModule.forFeature([Realm])],
  providers: [RealmSubscriber],
  controllers: [RealmsController],
})
export class RealmsModule {}
