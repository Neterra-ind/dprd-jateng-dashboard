import { useMemo, useState } from 'react';
import { usePimpinanLeader } from '../../lib/usePimpinanLeader';
import { useFilters } from '../../context/FilterContext';
import { SectionCard, EmptyState } from '../../components/ui';
import { NeutralTag } from '../../components/Badges';
import { pimpinanAktivitasByAnggota } from '../../data/pimpinanAktivitas';
import { isuById } from '../../data/isuWilayah';
import { filterAktivitasLike } from '../../lib/pimpinanFilters';
import { activityByCategory, activityMonthlySeries, executivePerformanceScore } from '../../lib/pimpinanAggregations';
import SimpleBarChart from '../../components/charts/SimpleBarChart';
import RankedBarList from '../../components/RankedBarList';
import type { PimpinanFungsi } from '../../data';

const categoryOptions: { value: PimpinanFungsi | 'all'; label: string }[] = [
  { value: 'all', label: 'Semua Fungsi' },
  { value: 'legislasi', label: 'Legislasi' },
  { value: 'anggaran', label: 'Anggaran' },
  { value: 'pengawasan', label: 'Pengawasan' },
  { value: 'representasi_publik', label: 'Representasi Publik' },
  { value: 'kepemimpinan', label: 'Kepemimpinan DPRD' },
];

export default function KinerjaPimpinan() {
  const { leader } = usePimpinanLeader();
  const { filters } = useFilters();
  const [fungsi, setFungsi] = useState<PimpinanFungsi | 'all'>('all');

  const allAktivitas = useMemo(() => pimpinanAktivitasByAnggota(leader.id), [leader]);
  const filtered = useMemo(() => {
    const base = filterAktivitasLike(allAktivitas, filters);
    return fungsi === 'all' ? base : base.filter((a) => a.fungsi === fungsi);
  }, [allAktivitas, filters, fungsi]);

  const categories = useMemo(() => activityByCategory(filtered), [filtered]);
  const monthly = useMemo(() => activityMonthlySeries(filtered), [filtered]);
  const score = useMemo(() => executivePerformanceScore(filtered), [filtered]);
  const chain = useMemo(() => [...filtered].sort((a, b) => b.eksposMedia - a.eksposMedia).slice(0, 5), [filtered]);

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-[15px] font-semibold text-ink">Kinerja Pimpinan — Executive Performance</h2>
          <p className="text-[12.5px] text-ink-soft">Activity & Visibility Analysis berdasarkan fungsi dan peran {leader.jabatan.toLowerCase()}</p>
        </div>
      </div>

      <div className="mb-4 flex flex-wrap gap-1.5">
        {categoryOptions.map((o) => (
          <button
            key={o.value}
            onClick={() => setFungsi(o.value)}
            className={`rounded-md px-3 py-1.5 text-[12.5px] font-medium ${
              fungsi === o.value ? 'bg-brand text-white' : 'border border-border bg-surface text-ink-soft hover:bg-surface-alt'
            }`}
          >
            {o.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 mb-4">
        <SectionCard title="Trend Aktivitas" className="lg:col-span-2">
          <SimpleBarChart data={monthly} />
        </SectionCard>
        <SectionCard title="Executive Performance Analytical Score" description="Skor ilustratif — bukan penilaian kinerja resmi">
          <div className="flex h-full flex-col items-center justify-center py-2">
            <p className="text-[42px] font-semibold text-brand">{score}</p>
            <p className="text-[11px] text-ink-faint">/100</p>
          </div>
        </SectionCard>
      </div>

      <SectionCard title="Aktivitas per Kategori" description="Legislasi · Anggaran · Pengawasan · Representasi Publik · Kepemimpinan DPRD" className="mb-4">
        <RankedBarList items={categories.map((c) => ({ id: c.fungsi, label: c.label, value: c.value, sub: `${c.ekspos} ekspos media` }))} />
      </SectionCard>

      <SectionCard
        title="Activity → Media → Public Response"
        description="Menjawab: apakah aktivitas pimpinan terlihat oleh publik?"
        className="mb-4"
      >
        {chain.length === 0 ? (
          <EmptyState message="Tidak ada aktivitas pada filter saat ini." />
        ) : (
          <div className="space-y-3">
            {chain.map((a) => {
              const isu = a.isuId ? isuById(a.isuId) : undefined;
              return (
                <div key={a.id} className="rounded-md border border-border p-3">
                  <p className="text-[13px] font-semibold text-ink">{a.judul}</p>
                  <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1.5 text-[11.5px]">
                    <span className="rounded-full bg-surface-alt px-2 py-0.5 text-ink-soft">{a.eksposMedia} berita</span>
                    <span className="text-ink-faint">→</span>
                    <span className="rounded-full bg-[var(--color-positive-soft)] px-2 py-0.5 text-[var(--color-positive)]">Positive {a.sentimentPositive}%</span>
                    <span className="text-ink-faint">→</span>
                    {isu && <span className="rounded-full bg-brand-soft px-2 py-0.5 text-brand">{isu.nama}</span>}
                    <span className="text-ink-faint">→</span>
                    <span className="rounded-full bg-surface-alt px-2 py-0.5 font-semibold text-ink">{a.publicEngagement.toLocaleString('id-ID')} engagement</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </SectionCard>

      <SectionCard title="Log Aktivitas" description={`${filtered.length} kegiatan pada periode terpilih`}>
        {filtered.length === 0 ? (
          <EmptyState message="Tidak ada aktivitas pada filter saat ini." />
        ) : (
          <div className="space-y-2.5 max-h-[420px] overflow-y-auto scrollbar-thin">
            {filtered.slice(0, 50).map((a) => (
              <div key={a.id} className="flex items-start justify-between gap-3 rounded-md border border-border p-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <NeutralTag>{categoryOptions.find((c) => c.value === a.fungsi)?.label}</NeutralTag>
                    <span className="text-[11px] text-ink-faint">
                      {new Date(a.tanggal).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </span>
                  </div>
                  <p className="mt-1 text-[12.5px] font-medium text-ink">{a.judul}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-[12px] font-semibold text-ink">{a.eksposMedia} ekspos</p>
                  <p className="text-[10.5px] text-ink-faint">{a.publicEngagement.toLocaleString('id-ID')} engagement</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </SectionCard>
    </div>
  );
}
