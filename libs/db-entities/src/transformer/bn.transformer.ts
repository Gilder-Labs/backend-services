import BN from 'bn.js';
import { ValueTransformer } from 'typeorm';

export class BNTransformer implements ValueTransformer {
  to(value: any) {
    if (value && value instanceof BN) {
      return value.toString();
    }
    return value;
  }
  from(value: any) {
    return value && new BN(value);
  }
}
