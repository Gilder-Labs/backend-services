import { Connection } from '@solana/web3.js';
import throttledQueue from 'throttled-queue';
import fetch from 'node-fetch';

const throttle = throttledQueue(24, 1000, true);

let connection: Connection;

export const getConnection = () =>
  connection ??
  (connection = new Connection(process.env.SOLANA_RPC_URL, {
    commitment: 'confirmed',
    fetch: async (input, init) => {
      const result = await throttle(async () => {
        return await fetch(input, init);
      });
      return result;
    },
  }));
