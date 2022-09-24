import { Module } from '@nestjs/common';
import { RealmsService } from './realms.service';

@Module({
  imports: [],
  providers: [RealmsService],
  exports: [RealmsService],
})
export class RealmsModule {}
