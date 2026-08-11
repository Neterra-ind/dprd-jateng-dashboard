import { ResponsiveContainer, Scatter, ScatterChart, Tooltip, XAxis, YAxis, ZAxis, ReferenceLine, Cell } from 'recharts';

export interface ContentMatrixPoint {
  id: string;
  topik: string;
  x: number;
  y: number;
  quadrant: 'priority' | 'improve' | 'audience_opportunity' | 'low_priority';
  views: number;
}

const quadrantColor: Record<ContentMatrixPoint['quadrant'], string> = {
  priority: 'var(--color-positive)',
  improve: 'var(--color-risk-medium)',
  audience_opportunity: 'var(--color-brand)',
  low_priority: 'var(--color-ink-faint)',
};

export default function ContentIssueMatrix({ data, height = 340 }: { data: ContentMatrixPoint[]; height?: number }) {
  return (
    <div className="relative">
      <div className="pointer-events-none absolute inset-0 grid grid-cols-2 grid-rows-2 text-[10.5px] font-medium text-ink-faint">
        <span className="p-2">IMPROVE COMMUNICATION</span>
        <span className="p-2 text-right">PRIORITY CONTENT</span>
        <span className="p-2 self-end">LOW PRIORITY</span>
        <span className="p-2 self-end text-right">AUDIENCE OPPORTUNITY</span>
      </div>
      <ResponsiveContainer width="100%" height={height}>
        <ScatterChart margin={{ top: 20, right: 20, bottom: 10, left: 0 }}>
          <XAxis
            type="number" dataKey="x" name="Public Engagement" domain={[0, 100]}
            tick={{ fontSize: 11, fill: 'var(--color-ink-faint)' }}
            label={{ value: 'Public Engagement →', position: 'insideBottom', offset: -5, fontSize: 11, fill: 'var(--color-ink-faint)' }}
          />
          <YAxis
            type="number" dataKey="y" name="Strategic Relevance" domain={[0, 100]}
            tick={{ fontSize: 11, fill: 'var(--color-ink-faint)' }}
            label={{ value: 'Strategic Relevance →', angle: -90, position: 'insideLeft', fontSize: 11, fill: 'var(--color-ink-faint)' }}
          />
          <ZAxis type="number" dataKey="views" range={[80, 320]} />
          <ReferenceLine x={50} stroke="var(--color-border-strong)" />
          <ReferenceLine y={50} stroke="var(--color-border-strong)" />
          <Tooltip
            cursor={{ strokeDasharray: '3 3' }}
            content={({ active, payload }) => {
              if (!active || !payload || !payload.length) return null;
              const p = payload[0].payload as ContentMatrixPoint;
              return (
                <div className="rounded-md border border-border bg-surface px-3 py-2 text-[12px] shadow-lg">
                  <p className="font-semibold text-ink">{p.topik}</p>
                  <p className="text-ink-soft">Engagement: {p.x} · Relevansi: {p.y}</p>
                  <p className="text-ink-soft">{p.views.toLocaleString('id-ID')} views</p>
                </div>
              );
            }}
          />
          <Scatter data={data}>
            {data.map((p) => (
              <Cell key={p.id} fill={quadrantColor[p.quadrant]} fillOpacity={0.85} />
            ))}
          </Scatter>
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
}
