import type { AlgorithmState } from '../state/types';
import type { Params } from '../types';

export interface ParameterBounds {
  slope: [number, number];
  intercept: [number, number];
  sigma: [number, number];
}

/** Compute axis bounds from all sample points, true mode, and current position. */
export function computeBounds(state: AlgorithmState): ParameterBounds {
  const allParams: Params[] = [
    state.config.trueParams,
    state.currentParams,
    ...state.burnInSamples.map((s) => s.params),
    ...state.acceptedSamples.map((s) => s.params),
  ];
  if (state.proposedParams) allParams.push(state.proposedParams);

  const pad = 0.5;
  let minSlope = Infinity;
  let maxSlope = -Infinity;
  let minIntercept = Infinity;
  let maxIntercept = -Infinity;
  let minSigma = Infinity;
  let maxSigma = -Infinity;

  for (const p of allParams) {
    if (p.slope < minSlope) minSlope = p.slope;
    if (p.slope > maxSlope) maxSlope = p.slope;
    if (p.intercept < minIntercept) minIntercept = p.intercept;
    if (p.intercept > maxIntercept) maxIntercept = p.intercept;
    if (p.sigma < minSigma) minSigma = p.sigma;
    if (p.sigma > maxSigma) maxSigma = p.sigma;
  }

  return {
    slope: [minSlope - pad, maxSlope + pad],
    intercept: [minIntercept - pad, maxIntercept + pad],
    sigma: [Math.max(0, minSigma - pad), maxSigma + pad],
  };
}

/** Normalize a parameter value to 0..10 range given bounds. */
export function normalize(value: number, bounds: [number, number]): number {
  const range = bounds[1] - bounds[0];
  if (range === 0) return 5;
  return ((value - bounds[0]) / range) * 10;
}

export function paramsToPosition(
  params: Params,
  bounds: ParameterBounds,
): [number, number, number] {
  return [
    normalize(params.slope, bounds.slope),
    normalize(params.intercept, bounds.intercept),
    normalize(params.sigma, bounds.sigma),
  ];
}
