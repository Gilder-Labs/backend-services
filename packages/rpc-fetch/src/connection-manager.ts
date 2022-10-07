import { RpcUri } from './types';
import { Connection } from '@solana/web3.js';
import throttledQueue from 'throttled-queue';
import axios from 'axios';

type ThrottleReturnType = ReturnType<typeof throttledQueue>;

class ConnectionManager {
  private readonly _connection: Connection;

  private connectionIndex = 0;
  private rpcUris: RpcUri[] = [];

  constructor(rpcUris: RpcUri[]) {
    this.rpcUris = rpcUris;
    this._connection = this.createConnection(rpcUris[0]);
  }

  get connection() {
    return this._connection;
  }

  private createConnection({ uri, rps }: RpcUri): Connection {
    const throttle = throttledQueue(rps, 1000, true);
    return new Connection(uri, {
      fetch: (input, init) => {
        return throttle(async () => {
          return await axios.request({
            url: input.toString(),
            headers: { ...init?.headers },
            httpAgent: init?.agent,
            httpsAgent: init?.agent,
            method: init?.method,
            data: init?.body,
          });
        });
      },
    });
  }
}

export { ConnectionManager };
