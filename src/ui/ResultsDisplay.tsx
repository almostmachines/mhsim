import type { Params } from '../types';

interface ResultsDisplayProps {
  estimates: {
    mean: Params;
    variance: Params;
  };
}

function Stat({ label, mean, variance }: { label: string; mean: number; variance: number }) {
  return (
    <div className="flex-1 min-w-0">
      <div className="text-xs text-slate-400 truncate">{label}</div>
      <div className="text-sm text-slate-200">{mean.toFixed(3)}</div>
      <div className="text-xs text-slate-500">&sigma;&sup2; {variance.toFixed(4)}</div>
    </div>
  );
}

export function ResultsDisplay({ estimates }: ResultsDisplayProps) {
  return (
    <div className="border-t border-slate-700 pt-3">
      <h2 className="text-sm font-semibold text-slate-300 mb-3">
        Results
      </h2>
      <div>
        <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
          Posterior Estimates
        </h3>
        <div className="flex gap-2">
          <Stat label="Slope" mean={estimates.mean.slope} variance={estimates.variance.slope} />
          <Stat label="Intercept" mean={estimates.mean.intercept} variance={estimates.variance.intercept} />
          <Stat label="Sigma" mean={estimates.mean.sigma} variance={estimates.variance.sigma} />
        </div>
      </div>
    </div>
  );
}
