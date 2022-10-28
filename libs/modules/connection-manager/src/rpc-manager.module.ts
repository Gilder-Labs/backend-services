import { DynamicModule, Global, Module, Provider } from '@nestjs/common';
import { RpcManagerService } from './rpc-manager.service';
import type { Endpoint } from '@gilder/rpc-manager';
import { ConnectionManager } from '@gilder/rpc-manager';
import {
  RPC_MANAGER_INSTANCE_TOKEN,
  RPC_MANAGER_MODULE_OPTIONS,
} from './constants';
import { RpcManagerModuleAsyncOptions } from './types';

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

  static forRootAsync(options: RpcManagerModuleAsyncOptions): DynamicModule {
    const moduleOptions = {
      provide: RPC_MANAGER_MODULE_OPTIONS,
      useFactory: options.useFactory,
      inject: options.inject || [],
    };

    const rpcManagerProvider = {
      provide: RPC_MANAGER_INSTANCE_TOKEN,
      useFactory: async (endpoints: Record<string, Endpoint[]>) =>
        new ConnectionManager(endpoints),
      inject: [RPC_MANAGER_MODULE_OPTIONS],
    };

    const providers: Provider[] = [moduleOptions, rpcManagerProvider];

    return {
      module: RpcManagerModule,
      imports: options.imports,
      providers: providers,
      exports: [rpcManagerProvider],
    };
  }
}
