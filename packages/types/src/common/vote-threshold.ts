import { VoteThresholdType } from '@solana/spl-governance';

export interface VoteThreshold {
  type: VoteThresholdType;
  value?: number;
}
