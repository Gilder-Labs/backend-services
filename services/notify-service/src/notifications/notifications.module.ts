import { Realm } from '@gilder/db-entities';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';

@Module({
  imports: [TypeOrmModule.forFeature([Realm])],
  providers: [],
  controllers: [],
})
export class RealmsModule {}
