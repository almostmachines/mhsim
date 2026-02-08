/** Box-Muller transform: generate a standard normal random variate */
export function randomNormal(mean = 0, std = 1): number {
  let u1 = 0;
  let u2 = 0;
  // Avoid log(0)
  while (u1 === 0) u1 = Math.random();
  while (u2 === 0) u2 = Math.random();
  const z = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
  return z * std + mean;
}

export function randomUniform(min: number, max: number): number {
  return min + Math.random() * (max - min);
}
