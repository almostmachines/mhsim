import type { DataPoint, Params } from '../types';
import { randomNormal } from './random';
import { logPosterior } from './model';

export interface StepResult {
  proposed: Params;
  logPosteriorCurrent: number;
  logPosteriorProposed: number;
  logRatio: number;
  acceptanceProbability: number;
  accepted: boolean;
  randomDraw: number;
  newParams: Params;
}

/** Propose new parameters by adding symmetric normal perturbation */
export function propose(current: Params, widths: Params): Params {
  return {
    slope: randomNormal(current.slope, widths.slope),
    intercept: randomNormal(current.intercept, widths.intercept),
    sigma: randomNormal(current.sigma, widths.sigma),
  };
}

/** Compute acceptance probability */
export function acceptanceProbability(
  logPosteriorCurrent: number,
  logPosteriorProposed: number,
): number {
  const logRatio = logPosteriorProposed - logPosteriorCurrent;
  return Math.min(1, Math.exp(logRatio));
}

/** Run one complete Metropolis-Hastings step */
export function step(
  current: Params,
  data: DataPoint[],
  widths: Params,
): StepResult {
  const proposed = propose(current, widths);
  const lpCurrent = logPosterior(current, data);
  const lpProposed = logPosterior(proposed, data);
  const logRatio = lpProposed - lpCurrent;
  const alpha = acceptanceProbability(lpCurrent, lpProposed);
  const u = Math.random();
  const accepted = u < alpha;

  return {
    proposed,
    logPosteriorCurrent: lpCurrent,
    logPosteriorProposed: lpProposed,
    logRatio,
    acceptanceProbability: alpha,
    accepted,
    randomDraw: u,
    newParams: accepted ? proposed : current,
  };
}
