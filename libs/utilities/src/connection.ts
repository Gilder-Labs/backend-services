import { Connection } from '@solana/web3.js';
import throttledQueue from 'throttled-queue';
import fetch from 'node-fetch';

let connection: Connection;

/**
 * @param rpcUrl {string} (default:  process.env.SOLANA_RPC_URL)
 * @param rps {string} Requests per second (default: 25)
 */
export const getConnection = (
  rpcUrl: string = process.env.SOLANA_RPC_URL!,
  rps = 25,
) => {
  const throttle = throttledQueue(rps, 1000, true);
  return (
    connection ??
    (connection = new Connection(rpcUrl, {
      commitment: 'confirmed',
      fetch: async (input, init) => {
        const result = await throttle(async () => {
          return await fetch(input, init);
        });
        return result;
      },
    }))
  );
};

export type { Connection };
