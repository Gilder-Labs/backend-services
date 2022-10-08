import { ConnectionManager } from '@gilder/rpc-manager';
import { Inject, Injectable } from '@nestjs/common';
import { RPC_MANAGER_INSTANCE_TOKEN } from './constants';

@Injectable()
export class RpcManagerService {
  constructor(
    @Inject(RPC_MANAGER_INSTANCE_TOKEN)
    private readonly manager: ConnectionManager,
  ) {}

  get connection() {
    return this.manager.connection;
  }
}
