import { RotateCcw } from 'lucide-react';
import { useFilters, type Periode } from '../context/FilterContext';
import { wilayahList } from '../data/wilayah';
import { komisiList } from '../data/komisi';
import { urusanList } from '../data/urusan';
import { opdList } from '../data/opd';
import { isuWilayahList } from '../data/isuWilayah';
import { anggotaList } from '../data/anggota';
import { mediaList } from '../data/media';

export type FilterKey =
  | 'periode'
  | 'wilayah'
  | 'komisi'
  | 'urusan'
  | 'opd'
  | 'isu'
  | 'anggota'
  | 'sentiment'
  | 'media'
  | 'platform';

const periodeOptions: { value: Periode; label: string }[] = [
  { value: '7d', label: '7 Hari Terakhir' },
  { value: '30d', label: '30 Hari Terakhir' },
  { value: '90d', label: '90 Hari Terakhir' },
  { value: 'all', label: 'Semua Periode' },
];

function Select({
  value,
  onChange,
  children,
}: {
  value: string;
  onChange: (v: string) => void;
  children: React.ReactNode;
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="rounded-md border border-border bg-surface px-2.5 py-1.5 text-[12.5px] text-ink-soft outline-none focus:border-brand-light hover:bg-surface-alt max-w-[160px]"
    >
      {children}
    </select>
  );
}

export default function GlobalFilterBar({ show }: { show: FilterKey[] }) {
  const { filters, setFilter, resetFilters, activeCount } = useFilters();

  return (
    <div className="mb-5 flex flex-wrap items-center gap-2 rounded-lg border border-border bg-surface-alt/60 p-2.5">
      {show.includes('periode') && (
        <Select value={filters.periode} onChange={(v) => setFilter('periode', v as Periode)}>
          {periodeOptions.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </Select>
      )}
      {show.includes('wilayah') && (
        <Select value={filters.wilayahId} onChange={(v) => setFilter('wilayahId', v)}>
          <option value="all">Semua Wilayah</option>
          {wilayahList.map((w) => (
            <option key={w.id} value={w.id}>{w.nama}</option>
          ))}
        </Select>
      )}
      {show.includes('komisi') && (
        <Select value={filters.komisiId} onChange={(v) => setFilter('komisiId', v)}>
          <option value="all">Semua Komisi</option>
          {komisiList.map((k) => (
            <option key={k.id} value={k.id}>{k.nama}</option>
          ))}
        </Select>
      )}
      {show.includes('urusan') && (
        <Select value={filters.urusanId} onChange={(v) => setFilter('urusanId', v)}>
          <option value="all">Semua Urusan</option>
          {urusanList.map((u) => (
            <option key={u.id} value={u.id}>{u.nama}</option>
          ))}
        </Select>
      )}
      {show.includes('opd') && (
        <Select value={filters.opdId} onChange={(v) => setFilter('opdId', v)}>
          <option value="all">Semua OPD</option>
          {opdList.map((o) => (
            <option key={o.id} value={o.id}>{o.singkatan}</option>
          ))}
        </Select>
      )}
      {show.includes('isu') && (
        <Select value={filters.isuId} onChange={(v) => setFilter('isuId', v)}>
          <option value="all">Semua Isu</option>
          {isuWilayahList.map((i) => (
            <option key={i.id} value={i.id}>{i.nama}</option>
          ))}
        </Select>
      )}
      {show.includes('anggota') && (
        <Select value={filters.anggotaId} onChange={(v) => setFilter('anggotaId', v)}>
          <option value="all">Semua Anggota</option>
          {anggotaList.map((a) => (
            <option key={a.id} value={a.id}>{a.nama}</option>
          ))}
        </Select>
      )}
      {show.includes('sentiment') && (
        <Select value={filters.sentiment} onChange={(v) => setFilter('sentiment', v as never)}>
          <option value="all">Semua Sentimen</option>
          <option value="positive">Positif</option>
          <option value="neutral">Netral</option>
          <option value="negative">Negatif</option>
        </Select>
      )}
      {show.includes('media') && (
        <Select value={filters.mediaId} onChange={(v) => setFilter('mediaId', v)}>
          <option value="all">Semua Media</option>
          {mediaList.map((m) => (
            <option key={m.id} value={m.id}>{m.nama}</option>
          ))}
        </Select>
      )}
      {show.includes('platform') && (
        <Select value={filters.platform} onChange={(v) => setFilter('platform', v as never)}>
          <option value="all">Semua Platform</option>
          <option value="instagram">Instagram</option>
          <option value="facebook">Facebook</option>
          <option value="tiktok">TikTok</option>
          <option value="youtube">YouTube</option>
          <option value="twitter">X / Twitter</option>
        </Select>
      )}

      {activeCount > 0 && (
        <button
          onClick={resetFilters}
          className="ml-auto flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-[12.5px] font-medium text-brand hover:bg-brand-soft"
        >
          <RotateCcw size={13} /> Reset ({activeCount})
        </button>
      )}
    </div>
  );
}
