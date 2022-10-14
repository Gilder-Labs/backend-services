import { DynamicModule, Global, Module } from '@nestjs/common';
import { RpcManagerService } from './rpc-manager.service';
import type { Endpoint } from '@gilderlabs/rpc-manager';
import { ConnectionManager } from '@gilderlabs/rpc-manager';
import { RPC_MANAGER_INSTANCE_TOKEN } from './constants';

@Global()
@Module({
  providers: [RpcManagerService],
  exports: [RpcManagerService],
})
export class RpcManagerModule {
  static forRoot(endpoints: Record<string, Endpoint[]>): DynamicModule {
    const providers = [
      {
        provide: RPC_MANAGER_INSTANCE_TOKEN,
        useValue: new ConnectionManager(endpoints),
      },
    ];

    return {
      module: RpcManagerModule,
      providers: providers,
      exports: providers,
    };
  }
}
