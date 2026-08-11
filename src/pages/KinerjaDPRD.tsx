import { useMemo, useState } from 'react';
import { PageHeader, SectionCard, EmptyState } from '../components/ui';
import GlobalFilterBar from '../components/GlobalFilterBar';
import { useFilters } from '../context/FilterContext';
import { aktivitasList } from '../data/aktivitas';
import { beritaList } from '../data/berita';
import { komisiById } from '../data/komisi';
import { anggotaById } from '../data/anggota';
import { filterAktivitas } from '../lib/filters';
import { monthlyActivitySeries, activityByKomisi, activityByFungsi, komisiAnalyticalScore } from '../lib/aggregations';
import SimpleBarChart from '../components/charts/SimpleBarChart';
import RankedBarList from '../components/RankedBarList';
import { NeutralTag } from '../components/Badges';
import type { AktivitasTipe, FungsiDPRD } from '../data';

const tipeLabel: Record<AktivitasTipe, string> = {
  rapat_komisi: 'Rapat Komisi',
  paripurna: 'Paripurna',
  raperda: 'Raperda',
  perda: 'Perda',
  pembahasan_apbd: 'Pembahasan APBD',
  kunjungan_kerja: 'Kunjungan Kerja',
  reses_aspirasi: 'Reses / Aspirasi',
  pernyataan_pers: 'Pernyataan Pers',
  rekomendasi: 'Rekomendasi',
};

const fungsiOptions: { value: FungsiDPRD | 'all'; label: string }[] = [
  { value: 'all', label: 'Semua Fungsi' },
  { value: 'legislasi', label: 'Legislasi' },
  { value: 'anggaran', label: 'Anggaran' },
  { value: 'pengawasan', label: 'Pengawasan' },
];

export default function KinerjaDPRD() {
  const { filters } = useFilters();
  const [fungsi, setFungsi] = useState<FungsiDPRD | 'all'>('all');

  const filtered = useMemo(() => {
    const base = filterAktivitas(aktivitasList, filters);
    return fungsi === 'all' ? base : base.filter((a) => a.fungsi === fungsi);
  }, [filters, fungsi]);

  const monthly = useMemo(() => monthlyActivitySeries(filtered), [filtered]);
  const byKomisi = useMemo(() => activityByKomisi(filtered), [filtered]);
  const byFungsi = useMemo(() => activityByFungsi(filtered), [filtered]);
  const scores = useMemo(() => komisiAnalyticalScore(filtered, beritaList), [filtered]);

  return (
    <div>
      <PageHeader
        title="Kinerja DPRD"
        breadcrumb="Legislasi · Anggaran · Pengawasan"
        description="Memantau pelaksanaan tiga fungsi utama DPRD: legislasi, anggaran, dan pengawasan, beserta eksposur medianya."
      />

      <GlobalFilterBar show={['periode', 'komisi']} />

      <div className="mb-5 flex flex-wrap gap-1.5">
        {fungsiOptions.map((o) => (
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

      <div className="grid grid-cols-1 gap-3 md:grid-cols-3 mb-5">
        {byFungsi.map((f) => (
          <div key={f.fungsi} className="rounded-lg border border-border bg-surface p-4">
            <p className="text-[11.5px] font-medium uppercase text-ink-faint">{f.label}</p>
            <p className="mt-1 text-[24px] font-semibold text-ink">{f.value}</p>
            <p className="mt-1 text-[12px] text-ink-soft">{f.ekspos.toLocaleString('id-ID')} ekspos media</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 mb-4">
        <SectionCard title="Aktivitas per Bulan" className="lg:col-span-2">
          <SimpleBarChart data={monthly} />
        </SectionCard>
        <SectionCard title="Aktivitas per Komisi">
          <RankedBarList items={byKomisi.map((k) => ({ id: k.id, label: k.label, value: k.value }))} />
        </SectionCard>
      </div>

      <SectionCard
        title="Analytical Score — Prototype"
        description="Skor ilustratif berbasis volume aktivitas dan eksposur media. Bukan penilaian kinerja resmi."
        className="mb-4"
      >
        <div className="overflow-x-auto -mx-4 lg:-mx-5">
          <table className="w-full min-w-[560px] text-[12.5px]">
            <thead>
              <tr className="border-b border-border text-left text-[11px] uppercase tracking-wide text-ink-faint">
                <th className="px-4 py-2 font-medium lg:px-5">Komisi</th>
                <th className="px-3 py-2 font-medium">Aktivitas</th>
                <th className="px-3 py-2 font-medium">Ekspos Media</th>
                <th className="px-3 py-2 font-medium">Analytical Score</th>
              </tr>
            </thead>
            <tbody>
              {scores.map((s) => (
                <tr key={s.id} className="border-b border-border last:border-0">
                  <td className="px-4 py-2.5 font-medium text-ink lg:px-5">{s.nama}</td>
                  <td className="px-3 py-2.5 text-ink-soft">{s.aktivitas}</td>
                  <td className="px-3 py-2.5 text-ink-soft">{s.ekspos}</td>
                  <td className="px-3 py-2.5">
                    <span className="rounded-full bg-brand-soft px-2.5 py-0.5 font-semibold text-brand">{s.score}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SectionCard>

      <SectionCard title="Log Aktivitas DPRD" description={`${filtered.length} kegiatan pada periode terpilih`}>
        {filtered.length === 0 ? (
          <EmptyState message="Tidak ada aktivitas pada filter saat ini." />
        ) : (
          <div className="space-y-2.5 max-h-[520px] overflow-y-auto scrollbar-thin -mx-1 px-1">
            {filtered.slice(0, 60).map((a) => (
              <div key={a.id} className="rounded-md border border-border p-3">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <NeutralTag>{tipeLabel[a.tipe]}</NeutralTag>
                      <span className="text-[11px] text-ink-faint">
                        {new Date(a.tanggal).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </span>
                    </div>
                    <p className="mt-1 text-[13px] font-medium text-ink">{a.judul}</p>
                    <p className="mt-0.5 text-[11.5px] text-ink-faint">
                      {a.komisiId ? komisiById(a.komisiId)?.nama : '—'} · {a.anggotaIds.slice(0, 2).map((id) => anggotaById(id)?.nama.split(',')[0]).join(', ')}
                      {a.anggotaIds.length > 2 ? ` +${a.anggotaIds.length - 2}` : ''}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-[12px] font-semibold text-ink">{a.eksposMedia} ekspos</p>
                    <p className="text-[10.5px] text-ink-faint capitalize">{a.status}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </SectionCard>
    </div>
  );
}
