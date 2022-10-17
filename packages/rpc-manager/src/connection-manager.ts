import { Connection } from '@solana/web3.js';
import fetch from 'node-fetch';
import throttledQueue from 'throttled-queue';

type Endpoint = {
  rps: number;
  uri: string;
};

class Limiter {
  private _activeRequests = 0;
  private _maxRps: number;
  private _endpoint: string;

  private _start = 0;

  constructor(endpoint: Endpoint) {
    this._endpoint = endpoint.uri;
    this._maxRps = endpoint.rps;
  }

  get rpcEndpoint(): string {
    this._activeRequests += 1;
    return this._endpoint;
  }

  get maxedRps(): boolean {
    if (this.hasBeenASecond) {
      this._activeRequests = 0;
      this._start = performance.now();
    }
    return this._activeRequests >= this._maxRps;
  }

  private get hasBeenASecond(): boolean {
    return performance.now() - this._start >= 1000;
  }
}

type ThrottleType = <Return = unknown>(
  fn: () => Return | Promise<Return>,
) => Promise<Return>;

type ConnectionState = {
  connection: Connection;
  limiters: Limiter[];
  currentIndex: number;
};

class ConnectionManager {
  private _connections: Map<string, ConnectionState> = new Map();

  constructor(endpoints: Record<string, Endpoint[]>) {
    for (const key of Object.keys(endpoints)) {
      const limiters = endpoints[key].map((e) => new Limiter(e));

      const getLimiter = () => {
        const state = this._connections.get(key)!;
        let index = state.currentIndex;
        const limiter = limiters[index];
        if (limiter.maxedRps) {
          index = index + 1 >= limiters.length ? 0 : index + 1;
        }
        this._connections.set(key, { ...state, currentIndex: index });
        return limiters[index];
      };

      const maxRps = endpoints[key].reduce((prev, cur) => prev + cur.rps, 0);
      const throttle = throttledQueue(maxRps, 1000, true);
      const connection = this.createConnection(
        endpoints[key][0],
        throttle,
        getLimiter,
      );

      this._connections.set(key, { connection, currentIndex: 0, limiters });
    }
  }

  public getConnnection(key: string): Connection {
    if (!this._connections.has(key)) {
      throw Error(`No key with name '${key}' found`);
    }
    return this._connections.get(key)!.connection;
  }

  private createConnection(
    endpoint: Endpoint,
    throttle: ThrottleType,
    getLimiter: () => Limiter,
  ) {
    return new Connection(endpoint.uri, {
      commitment: 'confirmed',
      fetch: async (_, init) => {
        const limiter = getLimiter();
        const rpcEndpoint = limiter.rpcEndpoint;
        return await throttle(async () => await fetch(rpcEndpoint, init));
      },
    });
  }
}

export { ConnectionManager };
export type { Endpoint };
