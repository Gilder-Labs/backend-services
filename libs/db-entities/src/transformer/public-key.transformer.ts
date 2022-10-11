import { PublicKey } from '@solana/web3.js';
import { ValueTransformer } from 'typeorm';

export class PublicKeyTransformer implements ValueTransformer {
  to(value: any) {
    if (value && value instanceof PublicKey) {
      return value.toBase58();
    }
    return value;
  }

  from(value: any) {
    return value && new PublicKey(value);
  }
}
