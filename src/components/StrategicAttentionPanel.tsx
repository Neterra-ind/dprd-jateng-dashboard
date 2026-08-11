import { TrendingUp, Flame, Activity, AlarmClockOff } from 'lucide-react';
import type { IsuWilayah } from '../data';
import { TrendTag } from './Badges';

function Column({
  icon: Icon,
  title,
  items,
  onSelect,
  renderMeta,
  emptyText,
}: {
  icon: React.ComponentType<{ size?: number; strokeWidth?: number }>;
  title: string;
  items: IsuWilayah[];
  onSelect: (id: string) => void;
  renderMeta: (isu: IsuWilayah) => React.ReactNode;
  emptyText: string;
}) {
  return (
    <div className="min-w-0 flex-1">
      <div className="mb-2.5 flex items-center gap-1.5 text-ink-soft">
        <Icon size={14} strokeWidth={2} />
        <p className="text-[12px] font-semibold uppercase tracking-wide">{title}</p>
      </div>
      {items.length === 0 ? (
        <p className="text-[12px] text-ink-faint">{emptyText}</p>
      ) : (
        <ul className="space-y-2">
          {items.slice(0, 3).map((isu) => (
            <li key={isu.id}>
              <button
                onClick={() => onSelect(isu.id)}
                className="w-full rounded-md px-2 py-1.5 -mx-2 text-left hover:bg-surface-alt"
              >
                <p className="truncate text-[12.5px] font-medium text-ink">{isu.nama}</p>
                <div className="mt-0.5">{renderMeta(isu)}</div>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default function StrategicAttentionPanel({
  isuList,
  onSelect,
}: {
  isuList: IsuWilayah[];
  onSelect: (id: string) => void;
}) {
  const meningkat = [...isuList].filter((i) => i.trend >= 20).sort((a, b) => b.trend - a.trend);
  const negatif = [...isuList].filter((i) => i.sentiment === 'negative').sort((a, b) => b.sentimentBreakdown.negative - a.sentimentBreakdown.negative);
  const engagementTinggi = [...isuList].sort((a, b) => b.volume - a.volume);
  const belumRespons = [...isuList].filter((i) => i.statusResponsDprd === 'belum').sort((a, b) => b.volume - a.volume);

  return (
    <div className="grid grid-cols-1 gap-5 divide-y divide-border md:grid-cols-4 md:divide-y-0 md:divide-x">
      <div className="md:pr-4">
        <Column
          icon={TrendingUp}
          title="Isu Meningkat"
          items={meningkat}
          onSelect={onSelect}
          renderMeta={(isu) => <TrendTag value={isu.trend} />}
          emptyText="Tidak ada isu dengan lonjakan signifikan."
        />
      </div>
      <div className="md:px-4 pt-5 md:pt-0">
        <Column
          icon={Flame}
          title="Sentimen Negatif"
          items={negatif}
          onSelect={onSelect}
          renderMeta={(isu) => <span className="text-[11.5px] text-[var(--color-negative)] font-semibold">{isu.sentimentBreakdown.negative}% negatif</span>}
          emptyText="Tidak ada isu bersentimen negatif dominan."
        />
      </div>
      <div className="md:px-4 pt-5 md:pt-0">
        <Column
          icon={Activity}
          title="Engagement Tinggi"
          items={engagementTinggi}
          onSelect={onSelect}
          renderMeta={(isu) => <span className="text-[11.5px] text-ink-faint">{isu.volume.toLocaleString('id-ID')} pemberitaan</span>}
          emptyText="Belum ada data engagement."
        />
      </div>
      <div className="md:pl-4 pt-5 md:pt-0">
        <Column
          icon={AlarmClockOff}
          title="Belum Direspons DPRD"
          items={belumRespons}
          onSelect={onSelect}
          renderMeta={() => <span className="text-[11.5px] text-[var(--color-negative)] font-semibold">Menunggu sikap DPRD</span>}
          emptyText="Seluruh isu utama telah direspons DPRD."
        />
      </div>
    </div>
  );
}
