import type { DataPoint, Params } from '../types';

interface ResultsDisplayProps {
  estimates: {
    mean: Params;
    variance: Params;
  };
  data: DataPoint[];
  trueParams: Params;
}

export function ResultsDisplay({ estimates, data, trueParams }: ResultsDisplayProps) {
  const chartWidth = 320;
  const chartHeight = 180;
  const padLeft = 34;
  const padRight = 12;
  const padTop = 12;
  const padBottom = 26;
  const plotWidth = chartWidth - padLeft - padRight;
  const plotHeight = chartHeight - padTop - padBottom;

  const lineAt = (params: Params, x: number) => params.slope * x + params.intercept;

  const dataX = data.map((point) => point.x);
  const minDataX = dataX.length > 0 ? Math.min(...dataX) : 0;
  const maxDataX = dataX.length > 0 ? Math.max(...dataX) : 10;
  const safeXSpan = Math.max(maxDataX - minDataX, 1);
  const xPadding = safeXSpan * 0.08;
  const xMin = minDataX - xPadding;
  const xMax = maxDataX + xPadding;

  const yCandidates = [
    ...data.map((point) => point.y),
    lineAt(trueParams, xMin),
    lineAt(trueParams, xMax),
    lineAt(estimates.mean, xMin),
    lineAt(estimates.mean, xMax),
  ];
  const minDataY = yCandidates.length > 0 ? Math.min(...yCandidates) : -1;
  const maxDataY = yCandidates.length > 0 ? Math.max(...yCandidates) : 1;
  const safeYSpan = Math.max(maxDataY - minDataY, 1);
  const yPadding = safeYSpan * 0.12;
  const yMin = minDataY - yPadding;
  const yMax = maxDataY + yPadding;

  const toChartX = (x: number) => padLeft + ((x - xMin) / (xMax - xMin)) * plotWidth;
  const toChartY = (y: number) => chartHeight - padBottom - ((y - yMin) / (yMax - yMin)) * plotHeight;

  const trueStartY = lineAt(trueParams, xMin);
  const trueEndY = lineAt(trueParams, xMax);
  const estimateStartY = lineAt(estimates.mean, xMin);
  const estimateEndY = lineAt(estimates.mean, xMax);

  const trueLinePath = `M ${toChartX(xMin)} ${toChartY(trueStartY)} L ${toChartX(xMax)} ${toChartY(trueEndY)}`;
  const estimatedLinePath = `M ${toChartX(xMin)} ${toChartY(estimateStartY)} L ${toChartX(xMax)} ${toChartY(estimateEndY)}`;

  const reportItems = [
    {
      label: 'Slope',
      mean: estimates.mean.slope,
      variance: estimates.variance.slope,
      trueValue: trueParams.slope,
    },
    {
      label: 'Intercept',
      mean: estimates.mean.intercept,
      variance: estimates.variance.intercept,
      trueValue: trueParams.intercept,
    },
    {
      label: 'Sigma',
      mean: estimates.mean.sigma,
      variance: estimates.variance.sigma,
      trueValue: trueParams.sigma,
    },
  ];

  const xTicks = Array.from({ length: 5 }, (_, i) => xMin + ((xMax - xMin) * i) / 4);
  const yTicks = Array.from({ length: 5 }, (_, i) => yMin + ((yMax - yMin) * i) / 4);

  return (
    <div className="border-t border-slate-700 pt-3">
      <h2 className="text-sm font-semibold text-slate-300 mb-3">
        Results
      </h2>
      <div className="mb-3 rounded-lg border border-slate-800 bg-slate-950 p-2">
        <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
          Data Fit
        </h3>
        <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full h-auto block rounded bg-slate-950">
          <rect x={0} y={0} width={chartWidth} height={chartHeight} fill="#020617" />

          {yTicks.map((tick) => {
            const y = toChartY(tick);
            return (
              <line
                key={`y-${tick}`}
                x1={padLeft}
                y1={y}
                x2={chartWidth - padRight}
                y2={y}
                stroke="#1e293b"
                strokeWidth={1}
              />
            );
          })}

          {xTicks.map((tick) => {
            const x = toChartX(tick);
            return (
              <line
                key={`x-${tick}`}
                x1={x}
                y1={padTop}
                x2={x}
                y2={chartHeight - padBottom}
                stroke="#1e293b"
                strokeWidth={1}
              />
            );
          })}

          <line
            x1={padLeft}
            y1={chartHeight - padBottom}
            x2={chartWidth - padRight}
            y2={chartHeight - padBottom}
            stroke="#475569"
            strokeWidth={1.5}
          />
          <line
            x1={padLeft}
            y1={padTop}
            x2={padLeft}
            y2={chartHeight - padBottom}
            stroke="#475569"
            strokeWidth={1.5}
          />

          <path d={trueLinePath} fill="none" stroke="#f59e0b" strokeWidth={2} />
          <path d={estimatedLinePath} fill="none" stroke="#22d3ee" strokeWidth={2} strokeDasharray="5 4" />

          {data.map((point, index) => (
            <circle
              key={`${point.x}-${point.y}-${index}`}
              cx={toChartX(point.x)}
              cy={toChartY(point.y)}
              r={2.6}
              fill="#cbd5e1"
              fillOpacity={0.85}
            />
          ))}

          {xTicks.map((tick) => (
            <text
              key={`x-label-${tick}`}
              x={toChartX(tick)}
              y={chartHeight - 8}
              textAnchor="middle"
              fill="#64748b"
              fontSize={9}
            >
              {tick.toFixed(1)}
            </text>
          ))}

          {yTicks.map((tick) => (
            <text
              key={`y-label-${tick}`}
              x={padLeft - 5}
              y={toChartY(tick) + 3}
              textAnchor="end"
              fill="#64748b"
              fontSize={9}
            >
              {tick.toFixed(1)}
            </text>
          ))}
        </svg>

        <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-xs text-slate-400">
          <div className="flex items-center gap-1.5">
            <span className="inline-block h-2 w-2 rounded-full bg-slate-300" />
            Evidence
          </div>
          <div className="flex items-center gap-1.5">
            <span className="inline-block h-0.5 w-3 bg-amber-400" />
            True line
          </div>
          <div className="flex items-center gap-1.5">
            <span className="inline-block h-0.5 w-3 bg-cyan-400" />
            Estimated line
          </div>
        </div>
      </div>
      <div className="rounded-md border border-slate-800 bg-slate-900/55 p-2">
        <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
          Posterior Report
        </h3>
        <div className="space-y-2 text-xs font-mono leading-5 text-slate-300 overflow-x-auto">
          {reportItems.map((item) => (
            <div key={item.label}>
              <div className="text-slate-200">{item.label}</div>
              <div className="pl-2 whitespace-nowrap">
                estimate={item.mean.toFixed(3)}  true={item.trueValue.toFixed(3)}  σ²={item.variance.toFixed(4)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
