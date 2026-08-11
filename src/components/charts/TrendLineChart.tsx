import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid, Area, AreaChart } from 'recharts';

export interface TrendPoint {
  label: string;
  value: number;
  secondary?: number;
}

export default function TrendLineChart({
  data,
  height = 220,
  color = 'var(--color-brand)',
  secondaryColor = 'var(--color-negative)',
  secondaryLabel,
  valueLabel = 'Volume',
  area = true,
}: {
  data: TrendPoint[];
  height?: number;
  color?: string;
  secondaryColor?: string;
  secondaryLabel?: string;
  valueLabel?: string;
  area?: boolean;
}) {
  const Chart = area ? AreaChart : LineChart;
  return (
    <ResponsiveContainer width="100%" height={height}>
      <Chart data={data} margin={{ top: 6, right: 8, left: -18, bottom: 0 }}>
        <defs>
          <linearGradient id="trendFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={0.22} />
            <stop offset="100%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid vertical={false} stroke="var(--color-border)" />
        <XAxis dataKey="label" tick={{ fontSize: 11, fill: 'var(--color-ink-faint)' }} axisLine={{ stroke: 'var(--color-border)' }} tickLine={false} />
        <YAxis tick={{ fontSize: 11, fill: 'var(--color-ink-faint)' }} axisLine={false} tickLine={false} width={36} />
        <Tooltip
          contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid var(--color-border)', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}
          labelStyle={{ fontWeight: 600, marginBottom: 2 }}
        />
        {area ? (
          <Area type="monotone" dataKey="value" name={valueLabel} stroke={color} fill="url(#trendFill)" strokeWidth={2} dot={false} />
        ) : (
          <Line type="monotone" dataKey="value" name={valueLabel} stroke={color} strokeWidth={2} dot={false} />
        )}
        {data.some((d) => d.secondary !== undefined) && (
          <Line type="monotone" dataKey="secondary" name={secondaryLabel ?? 'Sekunder'} stroke={secondaryColor} strokeWidth={2} dot={false} strokeDasharray="4 3" />
        )}
      </Chart>
    </ResponsiveContainer>
  );
}
