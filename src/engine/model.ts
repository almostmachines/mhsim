import type { DataPoint, Params } from '../types';

const LOG_2PI = Math.log(2 * Math.PI);

/** Log of the normal PDF */
function logNormalPdf(x: number, mean: number, std: number): number {
  const z = (x - mean) / std;
  return -0.5 * (LOG_2PI + 2 * Math.log(std) + z * z);
}

/** Log-likelihood: product of normal densities for all data points */
export function logLikelihood(params: Params, data: DataPoint[]): number {
  if (params.sigma <= 0) return -Infinity;
  let ll = 0;
  for (const { x, y } of data) {
    const predicted = params.slope * x + params.intercept;
    ll += logNormalPdf(y, predicted, params.sigma);
  }
  return ll;
}

/** Log-prior: Normal priors on slope/intercept, Uniform(0.01, 50) on sigma */
export function logPrior(params: Params): number {
  if (params.sigma <= 0.01 || params.sigma > 50) return -Infinity;

  // Normal(0, 10) prior on slope
  const lpSlope = logNormalPdf(params.slope, 0, 10);
  // Normal(0, 20) prior on intercept
  const lpIntercept = logNormalPdf(params.intercept, 0, 20);
  // Uniform(0.01, 50) on sigma => log(1 / (50 - 0.01)) = constant
  const lpSigma = -Math.log(50 - 0.01);

  return lpSlope + lpIntercept + lpSigma;
}

/** Log-posterior = log-likelihood + log-prior */
export function logPosterior(params: Params, data: DataPoint[]): number {
  const lp = logPrior(params);
  if (lp === -Infinity) return -Infinity;
  return logLikelihood(params, data) + lp;
}
