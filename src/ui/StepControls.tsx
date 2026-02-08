import type { Phase } from '../state/types';

interface StepControlsProps {
  phase: Phase;
  acceptanceProbability: number | null;
  onNextStep: () => void;
  onAccept: () => void;
  onStartAuto: () => void;
  onStopAuto: () => void;
  onReset: () => void;
}

export function StepControls({
  phase,
  acceptanceProbability,
  onNextStep,
  onAccept,
  onStartAuto,
  onStopAuto,
  onReset,
}: StepControlsProps) {
  const getAcceptLabel = () => {
    if (acceptanceProbability === null) return 'Accept';
    if (acceptanceProbability >= 1) return 'Accept (100%)';
    return `Accept (${(acceptanceProbability * 100).toFixed(1)}%)`;
  };

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        {phase === 'PROPOSAL_SHOWN' ? (
          <button
            onClick={onAccept}
            className="flex-1 px-3 py-2 bg-cyan-600 hover:bg-cyan-500 text-white text-sm font-medium rounded-lg transition-colors"
          >
            {getAcceptLabel()}
          </button>
        ) : (
          <button
            onClick={onNextStep}
            disabled={phase === 'AUTO_RUNNING' || phase === 'COMPLETED'}
            className="flex-1 px-3 py-2 bg-cyan-600 hover:bg-cyan-500 disabled:bg-slate-700 disabled:text-slate-500 text-white text-sm font-medium rounded-lg transition-colors"
          >
            Next Step
          </button>
        )}
      </div>
      <div className="flex gap-2">
        {phase === 'AUTO_RUNNING' ? (
          <button
            onClick={onStopAuto}
            className="flex-1 px-3 py-2 bg-amber-600 hover:bg-amber-500 text-white text-sm font-medium rounded-lg transition-colors"
          >
            Stop
          </button>
        ) : (
          <button
            onClick={onStartAuto}
            disabled={phase === 'COMPLETED'}
            className="flex-1 px-3 py-2 bg-slate-700 hover:bg-slate-600 disabled:bg-slate-800 disabled:text-slate-600 text-slate-200 text-sm font-medium rounded-lg transition-colors"
          >
            Full Auto
          </button>
        )}
        <button
          onClick={onReset}
          className="px-3 py-2 bg-slate-700 hover:bg-slate-600 text-slate-200 text-sm font-medium rounded-lg transition-colors"
        >
          Reset
        </button>
      </div>
    </div>
  );
}
