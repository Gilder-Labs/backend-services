import { Connection } from '@solana/web3.js';

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

class ConnectionManager {
  private _currentIndex = 0;
  private _limiters: Limiter[];
  private _connection: Connection;

  constructor(endpoints: Endpoint[]) {
    this._limiters = endpoints.map((e) => new Limiter(e));
    this._connection = this.createConnection(endpoints[0]);
  }

  get connection() {
    return this._connection;
  }

  private get _limiter() {
    let index = this._currentIndex;
    const limiter = this._limiters[index];
    if (limiter.maxedRps) {
      index = index + 1 >= this._limiters.length ? 0 : index + 1;
      this._currentIndex = index;
    }
    return this._limiters[index];
  }

  private createConnection(endpoint: Endpoint) {
    return new Connection(endpoint.uri, {
      commitment: 'confirmed',
      fetchMiddleware: async (_, init, fetch) => {
        const rpcEndpoint = this._limiter.rpcEndpoint;
        return fetch(rpcEndpoint, init);
      },
    });
  }
}

export { ConnectionManager };
export type { Endpoint };
