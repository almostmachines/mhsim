export interface Params {
  slope: number;
  intercept: number;
  sigma: number;
}

export interface DataPoint {
  x: number;
  y: number;
}

export interface AlgorithmConfig {
  totalSamples: number;
  burnInSamples: number;
  dataPoints: number;
  trueParams: Params;
  priorParams: Params;
  priorStdDevs: Params;
  initialParams: Params;
  proposalWidths: Params;
}

export const DEFAULT_CONFIG: AlgorithmConfig = {
  totalSamples: 1000,
  burnInSamples: 0,
  dataPoints: 50,
  trueParams: { slope: 2.5, intercept: 5.0, sigma: 3.0 },
  priorParams: { slope: 0.0, intercept: 0.0, sigma: 5.0 },
  priorStdDevs: { slope: 10.0, intercept: 20.0, sigma: 10.0 },
  initialParams: { slope: 0.0, intercept: 0.0, sigma: 5.0 },
  proposalWidths: { slope: 0.3, intercept: 1.0, sigma: 0.5 },
};
