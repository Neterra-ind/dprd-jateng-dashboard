import { useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { PageHeader, SectionCard, EmptyState } from '../components/ui';
import GlobalFilterBar from '../components/GlobalFilterBar';
import { useFilters } from '../context/FilterContext';
import { komisiList, komisiById } from '../data/komisi';
import { isuWilayahList } from '../data/isuWilayah';
import { anggotaList } from '../data/anggota';
import { beritaList } from '../data/berita';
import { oversightGapByIsuId } from '../data/oversightGap';
import { filterBerita, filterIsu } from '../lib/filters';
import { sentimentDistribution, topMediaByVolume } from '../lib/aggregations';
import { SentimentBadge, TrendTag, UrgencyBadge } from '../components/Badges';
import SentimentDonut from '../components/charts/SentimentDonut';
import RankedBarList from '../components/RankedBarList';

export default function IsuKomisi() {
  const { komisiId } = useParams();
  const navigate = useNavigate();
  const { filters } = useFilters();
  const komisi = komisiId ? komisiById(komisiId) : undefined;

  const isuKomisi = useMemo(
    () => (komisi ? filterIsu(isuWilayahList.filter((i) => i.komisiIds.includes(komisi.id)), filters) : []),
    [komisi, filters]
  );
  const beritaKomisi = useMemo(
    () => (komisi ? filterBerita(beritaList.filter((b) => b.komisiIds.includes(komisi.id)), filters) : []),
    [komisi, filters]
  );
  const anggotaKomisi = useMemo(() => (komisi ? anggotaList.filter((a) => a.komisiId === komisi.id) : []), [komisi]);
  const pernyataan = useMemo(() => beritaKomisi.filter((b) => b.pernyataan).slice(0, 6), [beritaKomisi]);
  const belumRespons = useMemo(() => isuKomisi.filter((i) => i.statusResponsDprd === 'belum'), [isuKomisi]);
  const meningkat = useMemo(() => [...isuKomisi].filter((i) => i.trend >= 15).sort((a, b) => b.trend - a.trend), [isuKomisi]);
  const negatif = useMemo(() => isuKomisi.filter((i) => i.sentiment === 'negative'), [isuKomisi]);
  const sentiment = useMemo(() => sentimentDistribution(beritaKomisi), [beritaKomisi]);
  const topMedia = useMemo(() => topMediaByVolume(beritaKomisi, 5), [beritaKomisi]);

  if (!komisi) return <EmptyState message="Komisi tidak ditemukan." />;

  return (
    <div>
      <PageHeader
        title="Komisi Intelligence"
        breadcrumb="Isu Komisi"
        description="Menghubungkan isu wilayah dengan urusan pemerintahan, OPD, dan ruang lingkup kerja setiap Komisi DPRD."
      />

      <div className="mb-5 flex flex-wrap gap-1.5 rounded-lg border border-border bg-surface-alt/60 p-1.5">
        {komisiList.map((k) => (
          <button
            key={k.id}
            onClick={() => navigate(`/isu-komisi/${k.id}`)}
            className={`rounded-md px-3.5 py-1.5 text-[12.5px] font-medium transition-colors ${
              k.id === komisi.id ? 'bg-brand text-white' : 'text-ink-soft hover:bg-surface'
            }`}
          >
            {k.nama}
          </button>
        ))}
      </div>

      <SectionCard className="mb-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="text-[15px] font-semibold text-ink">{komisi.nama} — {komisi.ruangLingkup}</h2>
            <p className="mt-1 text-[12.5px] text-ink-soft">Ketua: {komisi.ketua} · {anggotaKomisi.length} anggota</p>
          </div>
          <div className="flex gap-4 text-center">
            <div>
              <p className="text-[18px] font-semibold text-ink">{isuKomisi.length}</p>
              <p className="text-[10.5px] text-ink-faint uppercase">Isu Terpantau</p>
            </div>
            <div>
              <p className="text-[18px] font-semibold text-ink">{beritaKomisi.length}</p>
              <p className="text-[10.5px] text-ink-faint uppercase">Ekspos Media</p>
            </div>
            <div>
              <p className="text-[18px] font-semibold" style={{ color: belumRespons.length > 0 ? 'var(--color-negative)' : 'var(--color-positive)' }}>
                {belumRespons.length}
              </p>
              <p className="text-[10.5px] text-ink-faint uppercase">Belum Direspons</p>
            </div>
          </div>
        </div>
      </SectionCard>

      <GlobalFilterBar show={['periode', 'wilayah', 'urusan', 'sentiment']} />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          <SectionCard title="Top Issues" description="Isu dengan volume pemberitaan tertinggi di ruang lingkup Komisi ini">
            {isuKomisi.length === 0 ? (
              <EmptyState message="Tidak ada isu pada ruang lingkup Komisi ini." />
            ) : (
              <RankedBarList
                items={[...isuKomisi].sort((a, b) => b.volume - a.volume).map((i) => ({ id: i.id, label: i.nama, value: i.volume, sub: i.kategori }))}
                onSelect={(id) => navigate(`/isu-wilayah/${id}`)}
              />
            )}
          </SectionCard>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <SectionCard title="Isu Meningkat">
              {meningkat.length === 0 ? (
                <EmptyState message="Tidak ada isu dengan tren naik signifikan." />
              ) : (
                <div className="space-y-2">
                  {meningkat.map((i) => (
                    <button key={i.id} onClick={() => navigate(`/isu-wilayah/${i.id}`)} className="flex w-full items-center justify-between rounded-md px-2 py-1.5 -mx-2 text-left hover:bg-surface-alt">
                      <span className="text-[12.5px] font-medium text-ink truncate">{i.nama}</span>
                      <TrendTag value={i.trend} />
                    </button>
                  ))}
                </div>
              )}
            </SectionCard>
            <SectionCard title="Isu Negatif">
              {negatif.length === 0 ? (
                <EmptyState message="Tidak ada isu bersentimen negatif dominan." />
              ) : (
                <div className="space-y-2">
                  {negatif.map((i) => (
                    <button key={i.id} onClick={() => navigate(`/isu-wilayah/${i.id}`)} className="flex w-full items-center justify-between rounded-md px-2 py-1.5 -mx-2 text-left hover:bg-surface-alt">
                      <span className="text-[12.5px] font-medium text-ink truncate">{i.nama}</span>
                      <SentimentBadge sentiment="negative" />
                    </button>
                  ))}
                </div>
              )}
            </SectionCard>
          </div>

          <SectionCard title="Pernyataan Anggota" description="Kutipan pernyataan anggota Komisi dalam pemberitaan">
            {pernyataan.length === 0 ? (
              <EmptyState message="Belum ada pernyataan tercatat pada periode ini." />
            ) : (
              <div className="space-y-3">
                {pernyataan.map((b) => (
                  <div key={b.id} className="rounded-md border border-border p-3">
                    <p className="text-[12.5px] italic text-ink">{b.pernyataan}</p>
                    <p className="mt-1.5 text-[11.5px] text-ink-faint">{b.aktorUtama} · {b.headline}</p>
                  </div>
                ))}
              </div>
            )}
          </SectionCard>

          <SectionCard title="Isu Belum Direspons DPRD" description="Kandidat prioritas rapat kerja atau kunjungan Komisi">
            {belumRespons.length === 0 ? (
              <EmptyState message="Seluruh isu telah mendapat respons DPRD." />
            ) : (
              <div className="space-y-2">
                {belumRespons.map((i) => (
                  <button key={i.id} onClick={() => navigate(`/isu-wilayah/${i.id}`)} className="flex w-full items-center justify-between rounded-md border border-border px-3 py-2 text-left hover:border-brand-light">
                    <div>
                      <p className="text-[12.5px] font-medium text-ink">{i.nama}</p>
                      <p className="text-[11px] text-ink-faint">{oversightGapByIsuId(i.id)?.catatan}</p>
                    </div>
                    <UrgencyBadge urgency={i.urgency} />
                  </button>
                ))}
              </div>
            )}
          </SectionCard>
        </div>

        <div className="space-y-4">
          <SectionCard title="Sentimen Ekspos Komisi">
            <div className="flex justify-center">
              <SentimentDonut positive={sentiment.positive} neutral={sentiment.neutral} negative={sentiment.negative} size={140} />
            </div>
          </SectionCard>

          <SectionCard title="Media Peliput">
            {topMedia.length === 0 ? <EmptyState message="Belum ada data media." /> : (
              <RankedBarList items={topMedia.map((m) => ({ id: m.mediaId, label: m.nama, value: m.count }))} />
            )}
          </SectionCard>
        </div>
      </div>
    </div>
  );
}
