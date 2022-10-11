import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';

@Injectable()
export class GovernanceProgramsMonitorService
  implements OnModuleInit, OnModuleDestroy
{
  onModuleDestroy() {
    throw new Error('Method not implemented.');
  }
  onModuleInit() {
    throw new Error('Method not implemented.');
  }
}
