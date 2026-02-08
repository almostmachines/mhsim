import type { AlgorithmConfig } from '../types';

interface ParameterInputsProps {
  config: AlgorithmConfig;
  onChange: (config: AlgorithmConfig) => void;
  disabled: boolean;
}

function NumberInput({
  label,
  value,
  onChange,
  disabled,
  step = 0.1,
  min,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  disabled: boolean;
  step?: number;
  min?: number;
}) {
  return (
    <div className="flex flex-col gap-0.5 flex-1 min-w-0">
      <label className="text-xs text-slate-400 truncate">{label}</label>
      <input
        type="number"
        value={value}
        step={step}
        min={min}
        onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
        disabled={disabled}
        className="w-full px-2 py-1 bg-slate-800 border border-slate-600 rounded text-sm text-slate-200 text-right disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:border-cyan-500"
      />
    </div>
  );
}

export function ParameterInputs({
  config,
  onChange,
  disabled,
}: ParameterInputsProps) {
  const update = (partial: Partial<AlgorithmConfig>) =>
    onChange({ ...config, ...partial });

  return (
    <div className="space-y-3">
      <Section title="True Values">
        <NumberInput
          label="Slope"
          value={config.trueParams.slope}
          onChange={(v) =>
            update({ trueParams: { ...config.trueParams, slope: v } })
          }
          disabled={disabled}
        />
        <NumberInput
          label="Intercept"
          value={config.trueParams.intercept}
          onChange={(v) =>
            update({ trueParams: { ...config.trueParams, intercept: v } })
          }
          disabled={disabled}
        />
        <NumberInput
          label="Sigma"
          value={config.trueParams.sigma}
          onChange={(v) =>
            update({ trueParams: { ...config.trueParams, sigma: v } })
          }
          disabled={disabled}
          min={0.01}
        />
      </Section>

      <Section title="Evidence" className="w-1/2">
        <NumberInput
          label="Data points"
          value={config.dataPoints}
          onChange={(v) => update({ dataPoints: Math.max(1, Math.round(v)) })}
          disabled={disabled}
          step={5}
          min={1}
        />
      </Section>

      <Section title="Prior Belief">
        <NumberInput
          label="Slope"
          value={config.priorParams.slope}
          onChange={(v) =>
            update({ priorParams: { ...config.priorParams, slope: v } })
          }
          disabled={disabled}
        />
        <NumberInput
          label="Intercept"
          value={config.priorParams.intercept}
          onChange={(v) =>
            update({ priorParams: { ...config.priorParams, intercept: v } })
          }
          disabled={disabled}
        />
        <NumberInput
          label="Sigma"
          value={config.priorParams.sigma}
          onChange={(v) =>
            update({ priorParams: { ...config.priorParams, sigma: v } })
          }
          disabled={disabled}
          min={0.01}
        />
      </Section>

      <Section title="Proposal Widths">
        <NumberInput
          label="Slope"
          value={config.proposalWidths.slope}
          onChange={(v) =>
            update({ proposalWidths: { ...config.proposalWidths, slope: v } })
          }
          disabled={disabled}
          min={0.01}
        />
        <NumberInput
          label="Intercept"
          value={config.proposalWidths.intercept}
          onChange={(v) =>
            update({
              proposalWidths: { ...config.proposalWidths, intercept: v },
            })
          }
          disabled={disabled}
          min={0.01}
        />
        <NumberInput
          label="Sigma"
          value={config.proposalWidths.sigma}
          onChange={(v) =>
            update({ proposalWidths: { ...config.proposalWidths, sigma: v } })
          }
          disabled={disabled}
          min={0.01}
        />
      </Section>

      <Section title="Posterior Sampling">
        <NumberInput
          label="Total samples"
          value={config.totalSamples}
          onChange={(v) => update({ totalSamples: Math.max(1, Math.round(v)) })}
          disabled={disabled}
          step={50}
          min={1}
        />
        <NumberInput
          label="Burn-in"
          value={config.burnInSamples}
          onChange={(v) => update({ burnInSamples: Math.max(0, Math.round(v)) })}
          disabled={disabled}
          step={10}
          min={0}
        />
      </Section>

    </div>
  );
}

function Section({
  title,
  children,
  className,
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
        {title}
      </h3>
      <div className="flex gap-2">{children}</div>
    </div>
  );
}
