interface ProgressBarProps {
  burnInCurrent: number;
  burnInTotal: number;
  samplesCurrent: number;
  samplesTotal: number;
}

export function ProgressBar({
  burnInCurrent,
  burnInTotal,
  samplesCurrent,
  samplesTotal,
}: ProgressBarProps) {
  const inBurnIn = burnInCurrent < burnInTotal;
  const totalTarget = burnInTotal + samplesTotal;
  const totalCurrent = burnInCurrent + samplesCurrent;
  const pct = totalTarget > 0 ? (totalCurrent / totalTarget) * 100 : 0;

  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs text-slate-400">
        <span>
          {inBurnIn
            ? `Burn-in: ${burnInCurrent}/${burnInTotal}`
            : `Samples: ${samplesCurrent}/${samplesTotal}`}
        </span>
        <span>{Math.round(pct)}%</span>
      </div>
      <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-200"
          style={{
            width: `${pct}%`,
            background: inBurnIn
              ? '#64748b'
              : 'linear-gradient(90deg, #3b82f6, #a855f7)',
          }}
        />
      </div>
    </div>
  );
}
