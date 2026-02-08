import type { AlgorithmConfig, DataPoint, Params } from '../types';
import type { StepResult } from '../engine/metropolis';

export type Phase =
  | 'IDLE'
  | 'PROPOSAL_SHOWN'
  | 'RESULT_SHOWN'
  | 'AUTO_RUNNING'
  | 'COMPLETED';

export interface SampleRecord {
  params: Params;
  isBurnIn: boolean;
}

export interface AlgorithmState {
  phase: Phase;
  config: AlgorithmConfig;
  data: DataPoint[];
  currentParams: Params;
  proposedParams: Params | null;
  stepResult: StepResult | null;
  burnInSamples: SampleRecord[];
  acceptedSamples: SampleRecord[];
  totalSteps: number;
  acceptedCount: number;
  statusMessage: string;
  statusType: 'info' | 'success' | 'error' | 'warning';
}

export type AlgorithmAction =
  | { type: 'RESET'; config: AlgorithmConfig }
  | { type: 'NEXT_STEP' }
  | { type: 'ACCEPT' }
  | { type: 'START_AUTO' }
  | { type: 'STOP_AUTO' }
  | { type: 'AUTO_STEP' };
