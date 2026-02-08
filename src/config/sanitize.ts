import { DEFAULT_CONFIG, type AlgorithmConfig, type Params } from '../types';

const MIN_SIGMA = 0.01;
const MIN_PROPOSAL_WIDTH = 0.01;

function finiteNumber(value: number, fallback: number): number {
  return Number.isFinite(value) ? value : fallback;
}

function boundedInteger(value: number, fallback: number, min: number): number {
  const finite = finiteNumber(value, fallback);
  return Math.max(min, Math.round(finite));
}

function sanitizeParams(params: Params, fallback: Params, sigmaMin: number): Params {
  return {
    slope: finiteNumber(params.slope, fallback.slope),
    intercept: finiteNumber(params.intercept, fallback.intercept),
    sigma: Math.max(sigmaMin, finiteNumber(params.sigma, fallback.sigma)),
  };
}

export function sanitizeAlgorithmConfig(config: AlgorithmConfig): AlgorithmConfig {
  return {
    totalSamples: boundedInteger(config.totalSamples, DEFAULT_CONFIG.totalSamples, 1),
    burnInSamples: boundedInteger(config.burnInSamples, DEFAULT_CONFIG.burnInSamples, 0),
    dataPoints: boundedInteger(config.dataPoints, DEFAULT_CONFIG.dataPoints, 1),
    trueParams: sanitizeParams(config.trueParams, DEFAULT_CONFIG.trueParams, MIN_SIGMA),
    priorParams: sanitizeParams(config.priorParams, DEFAULT_CONFIG.priorParams, MIN_SIGMA),
    proposalWidths: {
      slope: Math.max(
        MIN_PROPOSAL_WIDTH,
        finiteNumber(config.proposalWidths.slope, DEFAULT_CONFIG.proposalWidths.slope),
      ),
      intercept: Math.max(
        MIN_PROPOSAL_WIDTH,
        finiteNumber(config.proposalWidths.intercept, DEFAULT_CONFIG.proposalWidths.intercept),
      ),
      sigma: Math.max(
        MIN_PROPOSAL_WIDTH,
        finiteNumber(config.proposalWidths.sigma, DEFAULT_CONFIG.proposalWidths.sigma),
      ),
    },
  };
}
