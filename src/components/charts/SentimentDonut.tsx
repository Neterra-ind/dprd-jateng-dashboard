import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';

export default function SentimentDonut({
  positive,
  neutral,
  negative,
  size = 160,
}: {
  positive: number;
  neutral: number;
  negative: number;
  size?: number;
}) {
  const data = [
    { name: 'Positif', value: positive, color: 'var(--color-positive)' },
    { name: 'Netral', value: neutral, color: 'var(--color-neutral)' },
    { name: 'Negatif', value: negative, color: 'var(--color-negative)' },
  ];

  return (
    <div className="flex items-center gap-5">
      <div style={{ width: size, height: size }} className="relative shrink-0">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={data} dataKey="value" innerRadius="62%" outerRadius="98%" paddingAngle={2} stroke="none">
              {data.map((d) => (
                <Cell key={d.name} fill={d.color} />
              ))}
            </Pie>
            <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid var(--color-border)' }} />
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-[18px] font-semibold text-ink">{positive}%</span>
          <span className="text-[10px] text-ink-faint">Positif</span>
        </div>
      </div>
      <div className="space-y-2">
        {data.map((d) => (
          <div key={d.name} className="flex items-center gap-2 text-[12.5px]">
            <span className="h-2.5 w-2.5 rounded-full" style={{ background: d.color }} />
            <span className="text-ink-soft w-14">{d.name}</span>
            <span className="font-semibold text-ink">{d.value}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}
