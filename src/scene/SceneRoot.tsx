import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { PointCloud } from './PointCloud';
import { TrueMode } from './TrueMode';
import { CurrentHypothesis } from './CurrentHypothesis';
import { ProposalPoint } from './ProposalPoint';
import { AxisSystem } from './AxisSystem';
import { Legend } from './Legend';
import type { AlgorithmState } from '../state/types';
import type { Params } from '../types';
import { useMemo } from 'react';

interface SceneRootProps {
  state: AlgorithmState;
}

/** Compute axis bounds from all sample points, true mode, and current position */
function computeBounds(state: AlgorithmState) {
  const allParams: Params[] = [
    state.config.trueParams,
    state.currentParams,
    ...state.burnInSamples.map((s) => s.params),
    ...state.acceptedSamples.map((s) => s.params),
  ];
  if (state.proposedParams) allParams.push(state.proposedParams);

  const pad = 0.5;
  let minSlope = Infinity, maxSlope = -Infinity;
  let minIntercept = Infinity, maxIntercept = -Infinity;
  let minSigma = Infinity, maxSigma = -Infinity;

  for (const p of allParams) {
    if (p.slope < minSlope) minSlope = p.slope;
    if (p.slope > maxSlope) maxSlope = p.slope;
    if (p.intercept < minIntercept) minIntercept = p.intercept;
    if (p.intercept > maxIntercept) maxIntercept = p.intercept;
    if (p.sigma < minSigma) minSigma = p.sigma;
    if (p.sigma > maxSigma) maxSigma = p.sigma;
  }

  return {
    slope: [minSlope - pad, maxSlope + pad] as [number, number],
    intercept: [minIntercept - pad, maxIntercept + pad] as [number, number],
    sigma: [Math.max(0, minSigma - pad), maxSigma + pad] as [number, number],
  };
}

/** Normalize a parameter value to 0..10 range given bounds */
export function normalize(
  value: number,
  bounds: [number, number],
): number {
  const range = bounds[1] - bounds[0];
  if (range === 0) return 5;
  return ((value - bounds[0]) / range) * 10;
}

export function paramsToPosition(
  params: Params,
  bounds: ReturnType<typeof computeBounds>,
): [number, number, number] {
  return [
    normalize(params.slope, bounds.slope),
    normalize(params.intercept, bounds.intercept),
    normalize(params.sigma, bounds.sigma),
  ];
}

export function SceneRoot({ state }: SceneRootProps) {
  const bounds = useMemo(() => computeBounds(state), [state]);

  return (
    <div className="relative flex-1 min-h-0">
      <Canvas
        camera={{ position: [15, 12, 15], fov: 50, near: 0.1, far: 200 }}
        style={{ background: '#0f172a' }}
      >
        <ambientLight intensity={0.6} />
        <directionalLight position={[10, 10, 10]} intensity={0.8} />
        <pointLight position={[-10, -10, -10]} intensity={0.3} />

        <AxisSystem bounds={bounds} />

        <PointCloud
          burnInSamples={state.burnInSamples}
          acceptedSamples={state.acceptedSamples}
          bounds={bounds}
        />

        <TrueMode
          position={paramsToPosition(state.config.trueParams, bounds)}
        />

        <CurrentHypothesis
          position={paramsToPosition(state.currentParams, bounds)}
        />

        {state.proposedParams && (
          <ProposalPoint
            proposalPosition={paramsToPosition(state.proposedParams, bounds)}
            currentPosition={paramsToPosition(state.currentParams, bounds)}
          />
        )}

        <OrbitControls
          enableDamping
          dampingFactor={0.1}
          target={[5, 5, 5]}
          minDistance={5}
          maxDistance={50}
        />
      </Canvas>

      <Legend />
    </div>
  );
}
