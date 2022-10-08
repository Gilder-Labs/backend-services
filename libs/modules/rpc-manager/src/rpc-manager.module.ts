import { DynamicModule, Module } from '@nestjs/common';
import { RpcManagerService } from './rpc-manager.service';
import { randomStringGenerator } from '@nestjs/common/utils/random-string-generator.util';
import type { Endpoint } from '@gilder/rpc-manager';
import { ConnectionManager } from '@gilder/rpc-manager';
import { RPC_MANAGER_INSTANCE_TOKEN, RPC_MANAGER_MODULE_ID } from './constants';

@Module({
  providers: [RpcManagerService],
  exports: [RpcManagerService],
})
export class RpcManagerModule {
  static register(endpoints: Endpoint[]): DynamicModule {
    return {
      module: RpcManagerModule,
      providers: [
        {
          provide: RPC_MANAGER_INSTANCE_TOKEN,
          useValue: new ConnectionManager(endpoints),
        },
        {
          provide: RPC_MANAGER_MODULE_ID,
          useValue: randomStringGenerator(),
        },
      ],
    };
  }
}
