import { TokenOwner } from '@gilder/gov-db-entities';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TokenOwnersService } from './token-owners.service';

@Module({
  imports: [TypeOrmModule.forFeature([TokenOwner])],
  providers: [TokenOwnersService],
  exports: [TokenOwnersService],
})
export class TokenOwnersServiceModule {}
