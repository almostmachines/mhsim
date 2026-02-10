import type { DataPoint, Params } from '../types';

const LOG_2PI = Math.log(2 * Math.PI);
const MIN_SIGMA = 0.01;

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

/** Log-prior: independent normals centered at configured prior belief means */
export function logPrior(params: Params, priorMeans: Params, priorStdDevs: Params): number {
  if (params.sigma < MIN_SIGMA) return -Infinity;
  if (priorStdDevs.slope <= 0 || priorStdDevs.intercept <= 0 || priorStdDevs.sigma <= 0) {
    return -Infinity;
  }

  const lpSlope = logNormalPdf(params.slope, priorMeans.slope, priorStdDevs.slope);
  const lpIntercept = logNormalPdf(params.intercept, priorMeans.intercept, priorStdDevs.intercept);
  const lpSigma = logNormalPdf(params.sigma, priorMeans.sigma, priorStdDevs.sigma);

  return lpSlope + lpIntercept + lpSigma;
}

/** Log-posterior = log-likelihood + log-prior */
export function logPosterior(
  params: Params,
  data: DataPoint[],
  priorMeans: Params,
  priorStdDevs: Params,
): number {
  const lp = logPrior(params, priorMeans, priorStdDevs);
  if (lp === -Infinity) return -Infinity;
  return logLikelihood(params, data) + lp;
}
