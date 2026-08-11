import { ResponsiveContainer, Scatter, ScatterChart, Tooltip, XAxis, YAxis, ZAxis, ReferenceLine, Cell } from 'recharts';
import type { NegativeIssueRisk } from '../../data';
import { isuById } from '../../data';

const levelColor: Record<string, string> = {
  low: 'var(--color-risk-low)',
  medium: 'var(--color-risk-medium)',
  high: 'var(--color-risk-high)',
  critical: 'var(--color-risk-critical)',
};

export default function RiskMatrix({
  data,
  onSelect,
  height = 380,
}: {
  data: NegativeIssueRisk[];
  onSelect?: (isuId: string) => void;
  height?: number;
}) {
  const points = data.map((r) => ({
    ...r,
    x: r.mediaExposure,
    y: r.potentialImpact,
    z: r.analyticalRiskScore,
    nama: isuById(r.isuId)?.nama ?? r.isuId,
  }));

  return (
    <div className="relative">
      <div className="pointer-events-none absolute inset-0 grid grid-cols-2 grid-rows-2 text-[10.5px] font-medium text-ink-faint">
        <span className="p-2">MANAGE</span>
        <span className="p-2 text-right">STRATEGIC ISSUE</span>
        <span className="p-2 self-end">MONITOR</span>
        <span className="p-2 self-end text-right">ATTENTION</span>
      </div>
      <ResponsiveContainer width="100%" height={height}>
        <ScatterChart margin={{ top: 20, right: 20, bottom: 10, left: 0 }}>
          <XAxis
            type="number"
            dataKey="x"
            name="Eksposur Media"
            domain={[0, 100]}
            tick={{ fontSize: 11, fill: 'var(--color-ink-faint)' }}
            label={{ value: 'Eksposur Media →', position: 'insideBottom', offset: -5, fontSize: 11, fill: 'var(--color-ink-faint)' }}
          />
          <YAxis
            type="number"
            dataKey="y"
            name="Dampak Potensial"
            domain={[0, 100]}
            tick={{ fontSize: 11, fill: 'var(--color-ink-faint)' }}
            label={{ value: 'Dampak Potensial →', angle: -90, position: 'insideLeft', fontSize: 11, fill: 'var(--color-ink-faint)' }}
          />
          <ZAxis type="number" dataKey="z" range={[80, 340]} />
          <ReferenceLine x={50} stroke="var(--color-border-strong)" />
          <ReferenceLine y={50} stroke="var(--color-border-strong)" />
          <Tooltip
            cursor={{ strokeDasharray: '3 3' }}
            contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid var(--color-border)' }}
            formatter={(value, name) => [value, name]}
            labelFormatter={() => ''}
            content={({ active, payload }) => {
              if (!active || !payload || !payload.length) return null;
              const p = payload[0].payload;
              return (
                <div className="rounded-md border border-border bg-surface px-3 py-2 text-[12px] shadow-lg">
                  <p className="font-semibold text-ink">{p.nama}</p>
                  <p className="text-ink-soft">Eksposur: {p.x} · Dampak: {p.y}</p>
                  <p className="text-ink-soft">Analytical Risk Score: {p.z}</p>
                </div>
              );
            }}
          />
          <Scatter data={points} onClick={(d: any) => onSelect?.(d.isuId)} cursor={onSelect ? 'pointer' : 'default'}>
            {points.map((p) => (
              <Cell key={p.id} fill={levelColor[p.level]} fillOpacity={0.85} />
            ))}
          </Scatter>
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
}
