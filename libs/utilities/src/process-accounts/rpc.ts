import { ProgramAccount } from '@solana/spl-governance';
import { AccountInfo, Connection } from '@solana/web3.js';
import fetch from 'node-fetch';
import { parseAccount } from './account-parser';
import { AccountType, RawAccount } from './types';
import { getAccountType } from './utils';

type ProgramAccountMap<T = any> = Record<AccountType, ProgramAccount<T>[]>;

const getAllProgramAccounts = async (
  governanceProgramPks: string[],
  endpoint: Connection | string,
): Promise<ProgramAccountMap> => {
  const allProgramData: RawAccount[] = [];
  let i = 0;
  for (const pk of governanceProgramPks) {
    try {
      const result = await fetch(
        endpoint instanceof Connection ? endpoint.rpcEndpoint : endpoint,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            jsonrpc: '2.0',
            id: i,
            method: 'getProgramAccounts',
            params: [
              pk,
              {
                commitment: 'confirmed',
                encoding: 'base64',
              },
            ],
          }),
        },
      )
        .then((r) => r.json())
        .then<RawAccount[]>((r: any) =>
          r.result.map((x: any) => ({
            account: x.account as AccountInfo<[string, string]>,
            pubkey: x.pubkey as string,
          })),
        );
      allProgramData.push(...result);
    } catch (err) {
      console.error(err);
    } finally {
      i++;
    }
  }

  const programParsedData = {} as ProgramAccountMap;
  const filteredData = allProgramData.flatMap((x) => x);

  for (const { pubkey, account } of filteredData) {
    const parsedData = parseAccount(pubkey, account);
    if (!parsedData) {
      continue;
    }

    const accountType = getAccountType(parsedData?.type);
    if (!accountType) {
      continue;
    }

    const { account: parsedAccount } = parsedData;
    if (programParsedData[accountType]) {
      programParsedData[accountType].push(parsedAccount);
    } else {
      programParsedData[accountType] = [parsedAccount];
    }
  }

  return programParsedData;
};

export { getAllProgramAccounts };
