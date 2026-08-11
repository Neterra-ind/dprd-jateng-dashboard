import { ProgressBar } from './ui';

export interface RankedItem {
  id: string;
  label: string;
  value: number;
  valueLabel?: string;
  sub?: string;
  colorVar?: string;
}

export default function RankedBarList({
  items,
  onSelect,
}: {
  items: RankedItem[];
  onSelect?: (id: string) => void;
}) {
  const max = Math.max(...items.map((i) => i.value), 1);
  return (
    <div className="space-y-2.5">
      {items.map((item, idx) => (
        <div
          key={item.id}
          onClick={() => onSelect?.(item.id)}
          className={`group flex items-center gap-3 rounded-md px-1.5 py-1 -mx-1.5 ${onSelect ? 'cursor-pointer hover:bg-surface-alt' : ''}`}
        >
          <span className="w-4 shrink-0 text-[11.5px] font-medium text-ink-faint">{idx + 1}</span>
          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between gap-2">
              <p className={`truncate text-[12.5px] font-medium text-ink ${onSelect ? 'group-hover:text-brand' : ''}`}>{item.label}</p>
              <span className="shrink-0 text-[12px] font-semibold text-ink-soft">
                {item.valueLabel ?? item.value.toLocaleString('id-ID')}
              </span>
            </div>
            {item.sub && <p className="text-[11px] text-ink-faint">{item.sub}</p>}
            <div className="mt-1">
              <ProgressBar value={(item.value / max) * 100} colorVar={item.colorVar} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
