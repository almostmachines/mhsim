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
    return { mean, variance };
  }, [state.acceptedSamples]);

  return (
    <div className="w-[340px] shrink-0 bg-slate-800/50 border-l border-slate-700 flex flex-col overflow-y-auto">
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
          <ResultsDisplay estimates={estimates} />
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
