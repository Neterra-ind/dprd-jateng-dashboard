import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader, SectionCard, EmptyState } from '../components/ui';
import GlobalFilterBar from '../components/GlobalFilterBar';
import { useFilters } from '../context/FilterContext';
import { beritaList } from '../data/berita';
import { mediaById } from '../data/media';
import { isuById } from '../data/isuWilayah';
import { filterBerita } from '../lib/filters';
import { sentimentDistribution, topMediaByVolume, weeklyTrendSeries } from '../lib/aggregations';
import { SentimentBadge } from '../components/Badges';
import SentimentDonut from '../components/charts/SentimentDonut';
import RankedBarList from '../components/RankedBarList';
import TrendLineChart from '../components/charts/TrendLineChart';

export default function MediaMonitoring() {
  const { filters } = useFilters();
  const navigate = useNavigate();

  const filtered = useMemo(() => filterBerita(beritaList, filters).sort((a, b) => (a.tanggal < b.tanggal ? 1 : -1)), [filters]);
  const sentiment = useMemo(() => sentimentDistribution(filtered), [filtered]);
  const topMedia = useMemo(() => topMediaByVolume(filtered, 6), [filtered]);
  const trend = useMemo(() => weeklyTrendSeries(filtered), [filtered]);
  const shareOfVoice = useMemo(() => {
    const dprd = filtered.filter((b) => b.anggotaIds.length > 0).length;
    return filtered.length > 0 ? Math.round((dprd / filtered.length) * 100) : 0;
  }, [filtered]);

  return (
    <div>
      <PageHeader
        title="Media Monitoring"
        breadcrumb="Media Online, Lokal & Nasional"
        description="Memantau seluruh pemberitaan media terkait isu wilayah dan aktivitas DPRD Provinsi Jawa Tengah."
      />

      <GlobalFilterBar show={['periode', 'wilayah', 'komisi', 'isu', 'sentiment', 'media']} />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 mb-4">
        <SectionCard title="Trend Pemberitaan" className="lg:col-span-2">
          <TrendLineChart data={trend} />
        </SectionCard>
        <SectionCard title="Sentimen">
          <div className="flex h-[220px] items-center justify-center">
            <SentimentDonut positive={sentiment.positive} neutral={sentiment.neutral} negative={sentiment.negative} />
          </div>
        </SectionCard>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 mb-4">
        <SectionCard title="Media Ranking" description="Berdasarkan jumlah pemberitaan">
          <RankedBarList items={topMedia.map((m) => ({ id: m.mediaId, label: m.nama, value: m.count }))} />
        </SectionCard>
        <SectionCard title="Share of Voice DPRD">
          <div className="flex h-full flex-col items-center justify-center py-4">
            <p className="text-[40px] font-semibold text-brand">{shareOfVoice}%</p>
            <p className="mt-1 text-[12px] text-ink-soft text-center">dari total pemberitaan menyebut anggota/komisi DPRD</p>
          </div>
        </SectionCard>
        <SectionCard title="Top Headlines" description="Pemberitaan terbaru">
          <div className="space-y-2">
            {filtered.slice(0, 4).map((b) => (
              <button key={b.id} onClick={() => navigate(`/media-monitoring/${b.id}`)} className="block w-full rounded-md px-1.5 py-1 -mx-1.5 text-left hover:bg-surface-alt">
                <p className="truncate text-[12px] font-medium text-ink">{b.headline}</p>
              </button>
            ))}
          </div>
        </SectionCard>
      </div>

      <SectionCard title="Daftar Berita" description={`${filtered.length} berita ditemukan`}>
        {filtered.length === 0 ? (
          <EmptyState message="Tidak ada berita yang sesuai dengan filter." />
        ) : (
          <div className="overflow-x-auto -mx-4 lg:-mx-5">
            <table className="w-full min-w-[1000px] text-[12.5px]">
              <thead>
                <tr className="border-b border-border text-left text-[11px] uppercase tracking-wide text-ink-faint">
                  <th className="px-4 py-2 font-medium lg:px-5">Headline</th>
                  <th className="px-3 py-2 font-medium">Media</th>
                  <th className="px-3 py-2 font-medium">Tanggal</th>
                  <th className="px-3 py-2 font-medium">Isu</th>
                  <th className="px-3 py-2 font-medium">Aktor</th>
                  <th className="px-3 py-2 font-medium">Sentimen</th>
                  <th className="px-3 py-2 font-medium">Tone</th>
                </tr>
              </thead>
              <tbody>
                {filtered.slice(0, 100).map((b) => (
                  <tr
                    key={b.id}
                    onClick={() => navigate(`/media-monitoring/${b.id}`)}
                    className="cursor-pointer border-b border-border last:border-0 hover:bg-surface-alt"
                  >
                    <td className="px-4 py-2.5 font-medium text-ink lg:px-5 max-w-[320px]">{b.headline}</td>
                    <td className="px-3 py-2.5 text-ink-soft">{mediaById(b.mediaId)?.nama}</td>
                    <td className="px-3 py-2.5 text-ink-soft whitespace-nowrap">
                      {new Date(b.tanggal).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </td>
                    <td className="px-3 py-2.5 text-ink-soft">{isuById(b.isuId)?.nama}</td>
                    <td className="px-3 py-2.5 text-ink-soft">{b.aktorUtama}</td>
                    <td className="px-3 py-2.5"><SentimentBadge sentiment={b.sentiment} /></td>
                    <td className="px-3 py-2.5 text-ink-soft">{b.tone}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </SectionCard>
    </div>
  );
}
