import type { DataPoint, Params } from '../types';
import { randomNormal, randomUniform } from './random';

export function generateData(trueParams: Params, n: number): DataPoint[] {
  const data: DataPoint[] = [];
  for (let i = 0; i < n; i++) {
    const x = randomUniform(0, 10);
    const y =
      trueParams.slope * x +
      trueParams.intercept +
      randomNormal(0, trueParams.sigma);
    data.push({ x, y });
  }
  return data;
}
