import { useMemo } from 'react';
import type { AlgorithmConfig } from '../types';
import type { AlgorithmState } from '../state/types';
import { StepControls } from './StepControls';
import { ParameterInputs } from './ParameterInputs';
import { ResultsDisplay } from './ResultsDisplay';
import { StatusDisplay } from './StatusDisplay';
import { ProgressBar } from './ProgressBar';

interface ControlPanelProps {
  state: AlgorithmState;
  config: AlgorithmConfig;
  onConfigChange: (config: AlgorithmConfig) => void;
  onNextStep: () => void;
  onAccept: () => void;
  onStartAuto: () => void;
  onStopAuto: () => void;
  onReset: () => void;
}

export function ControlPanel({
  state,
  config,
  onConfigChange,
  onNextStep,
  onAccept,
  onStartAuto,
  onStopAuto,
  onReset,
}: ControlPanelProps) {
  const notIdle = state.phase !== 'IDLE';
  const acceptanceRate =
    state.totalSteps > 0
      ? (state.acceptedCount / state.totalSteps) * 100
      : 0;

  const estimates = useMemo(() => {
    const samples = state.acceptedSamples;
    if (samples.length < 2) return null;
    const n = samples.length;
    const mean = { slope: 0, intercept: 0, sigma: 0 };
    for (const s of samples) {
      mean.slope += s.params.slope;
      mean.intercept += s.params.intercept;
      mean.sigma += s.params.sigma;
    }
    mean.slope /= n;
    mean.intercept /= n;
    mean.sigma /= n;
    const variance = { slope: 0, intercept: 0, sigma: 0 };
    for (const s of samples) {
      variance.slope += (s.params.slope - mean.slope) ** 2;
      variance.intercept += (s.params.intercept - mean.intercept) ** 2;
      variance.sigma += (s.params.sigma - mean.sigma) ** 2;
    }
    variance.slope /= n - 1;
    variance.intercept /= n - 1;
    variance.sigma /= n - 1;

    const percentile = (sorted: number[], p: number) => {
      const idx = (p / 100) * (sorted.length - 1);
      const lo = Math.floor(idx);
      const hi = Math.ceil(idx);
      if (lo === hi) return sorted[lo];
      return sorted[lo] + (idx - lo) * (sorted[hi] - sorted[lo]);
    };

    const slopeVals = samples.map(s => s.params.slope).sort((a, b) => a - b);
    const interceptVals = samples.map(s => s.params.intercept).sort((a, b) => a - b);
    const sigmaVals = samples.map(s => s.params.sigma).sort((a, b) => a - b);

    const ci95 = {
      slope: [percentile(slopeVals, 2.5), percentile(slopeVals, 97.5)] as [number, number],
      intercept: [percentile(interceptVals, 2.5), percentile(interceptVals, 97.5)] as [number, number],
      sigma: [percentile(sigmaVals, 2.5), percentile(sigmaVals, 97.5)] as [number, number],
    };

    return { mean, variance, ci95 };
  }, [state.acceptedSamples]);

  return (
    <div className="w-full md:w-[420px] shrink-0 bg-slate-800/50 border-t md:border-t-0 md:border-l border-slate-700 flex flex-col overflow-y-auto">
      <div className="p-4 space-y-4">
        <StepControls
          phase={state.phase}
          acceptanceProbability={
            state.stepResult?.acceptanceProbability ?? null
          }
          onNextStep={onNextStep}
          onAccept={onAccept}
          onStartAuto={onStartAuto}
          onStopAuto={onStopAuto}
          onReset={onReset}
        />

        <ProgressBar
          burnInCurrent={state.burnInSamples.length}
          burnInTotal={state.config.burnInSamples}
          samplesCurrent={state.acceptedSamples.length}
          samplesTotal={state.config.totalSamples}
        />

        <StatusDisplay
          message={state.statusMessage}
          type={state.statusType}
          acceptanceRate={acceptanceRate}
          totalSteps={state.totalSteps}
        />

        {state.stepResult && state.phase === 'PROPOSAL_SHOWN' && (
          <div className="bg-slate-900/50 rounded-lg p-3 text-xs space-y-1">
            <div className="text-slate-500 font-semibold uppercase tracking-wider mb-1">
              Proposal Details
            </div>
            <div className="text-slate-400">
              Slope: {state.currentParams.slope.toFixed(3)} →{' '}
              <span className="text-white">
                {state.stepResult.proposed.slope.toFixed(3)}
              </span>
            </div>
            <div className="text-slate-400">
              Intercept: {state.currentParams.intercept.toFixed(3)} →{' '}
              <span className="text-white">
                {state.stepResult.proposed.intercept.toFixed(3)}
              </span>
            </div>
            <div className="text-slate-400">
              Sigma: {state.currentParams.sigma.toFixed(3)} →{' '}
              <span className="text-white">
                {state.stepResult.proposed.sigma.toFixed(3)}
              </span>
            </div>
            <div className="border-t border-slate-700 mt-2 pt-2 text-slate-400">
              Log posterior: {state.stepResult.logPosteriorCurrent.toFixed(2)} →{' '}
              {state.stepResult.logPosteriorProposed.toFixed(2)}
            </div>
            <div className="text-slate-400">
              Log ratio: {state.stepResult.logRatio.toFixed(4)}
            </div>
          </div>
        )}

        {estimates && (
          <ResultsDisplay
            estimates={estimates}
            data={state.data}
            trueParams={state.config.trueParams}
          />
        )}

        <div className="border-t border-slate-700 pt-3">
          <h2 className="text-sm font-semibold text-slate-300 mb-3">
            Settings
          </h2>
          <ParameterInputs
            config={config}
            onChange={onConfigChange}
            disabled={notIdle}
          />
        </div>
      </div>
    </div>
  );
}
