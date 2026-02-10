interface StatusDisplayProps {
  message: string;
  type: 'info' | 'success' | 'error' | 'warning';
  acceptanceRate: number;
  totalSteps: number;
}

const typeStyles: Record<string, string> = {
  info: 'border-cyan-500/30 bg-cyan-950/30 text-cyan-300',
  success: 'border-green-500/30 bg-green-950/30 text-green-300',
  error: 'border-red-500/30 bg-red-950/30 text-red-300',
  warning: 'border-amber-500/30 bg-amber-950/30 text-amber-300',
};

export function StatusDisplay({
  message,
  type,
  acceptanceRate,
  totalSteps,
}: StatusDisplayProps) {
  return (
    <div className="space-y-2">
      <div
        className={`border rounded-lg px-3 py-2 text-xs ${typeStyles[type]}`}
      >
        {message}
      </div>
      {totalSteps > 0 && (
        <div className="text-xs text-slate-500">
          Steps: {totalSteps} | Acceptance rate: {acceptanceRate.toFixed(1)}%
        </div>
      )}
    </div>
  );
}
