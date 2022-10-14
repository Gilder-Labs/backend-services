import { Realm } from '@gilderlabs/types';
import { PublicKey } from '@solana/web3.js';

export const transformRealm = ({
  realmPk,
  programPk,
  ...rest
}: Realm<string>): Realm => {
  return {
    ...rest,
    realmPk: new PublicKey(realmPk),
    programPk: new PublicKey(programPk),
  };
};
