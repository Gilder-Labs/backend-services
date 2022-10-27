import type { Endpoint } from '@gilder/rpc-manager';
import { ModuleMetadata, Provider } from '@nestjs/common';

export interface RpcManagerModuleAsyncOptions
  extends Pick<ModuleMetadata, 'imports'> {
  name?: string;
  useFactory: (
    ...args: any[]
  ) => Promise<Record<string, Endpoint[]>> | Record<string, Endpoint[]>;
  inject?: any[];
  extraProviders?: Provider[];
}
