import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePimpinanLeader } from '../../lib/usePimpinanLeader';
import { useFilters } from '../../context/FilterContext';
import { SectionCard, EmptyState } from '../../components/ui';
import { beritaList } from '../../data/berita';
import { mediaById } from '../../data/media';
import { isuById } from '../../data/isuWilayah';
import { filterBerita } from '../../lib/filters';
import { sentimentDistribution, topMediaByVolume, weeklyTrendSeries } from '../../lib/aggregations';
import { SentimentBadge } from '../../components/Badges';
import SentimentDonut from '../../components/charts/SentimentDonut';
import RankedBarList from '../../components/RankedBarList';
import TrendLineChart from '../../components/charts/TrendLineChart';

export default function MediaExposure() {
  const { leader } = usePimpinanLeader();
  const { filters } = useFilters();
  const navigate = useNavigate();

  const leaderBerita = useMemo(() => beritaList.filter((b) => b.anggotaIds.includes(leader.id)), [leader]);
  const filtered = useMemo(() => filterBerita(leaderBerita, filters).sort((a, b) => (a.tanggal < b.tanggal ? 1 : -1)), [leaderBerita, filters]);
  const sentiment = useMemo(() => sentimentDistribution(filtered), [filtered]);
  const topMedia = useMemo(() => topMediaByVolume(filtered, 6), [filtered]);
  const trend = useMemo(() => weeklyTrendSeries(filtered), [filtered]);

  return (
    <div>
      <div className="mb-4">
        <h2 className="text-[15px] font-semibold text-ink">Media Exposure — {leader.nama.split(',')[0]}</h2>
        <p className="text-[12.5px] text-ink-soft">Bagaimana media menggambarkan pimpinan dalam pemberitaan</p>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 mb-4">
        <SectionCard title="Trend Ekspos Personal" className="lg:col-span-2">
          <TrendLineChart data={trend} />
        </SectionCard>
        <SectionCard title="Sentimen Personal">
          <div className="flex h-[220px] items-center justify-center">
            <SentimentDonut positive={sentiment.positive} neutral={sentiment.neutral} negative={sentiment.negative} />
          </div>
        </SectionCard>
      </div>

      <SectionCard title="Media Ranking" description="Media yang paling banyak memberitakan pimpinan" className="mb-4">
        {topMedia.length === 0 ? <EmptyState message="Belum ada data media." /> : (
          <RankedBarList items={topMedia.map((m) => ({ id: m.mediaId, label: m.nama, value: m.count }))} />
        )}
      </SectionCard>

      <SectionCard title="Pemberitaan Personal" description={`${filtered.length} berita ditemukan`}>
        {filtered.length === 0 ? (
          <EmptyState message="Tidak ada berita yang sesuai dengan filter." />
        ) : (
          <div className="space-y-2.5">
            {filtered.slice(0, 20).map((b) => (
              <button
                key={b.id}
                onClick={() => navigate(`/media-monitoring/${b.id}`)}
                className="flex w-full items-start justify-between gap-3 rounded-md border border-border p-3 text-left hover:border-brand-light"
              >
                <div className="min-w-0">
                  <p className="truncate text-[12.5px] font-medium text-ink">{b.headline}</p>
                  <p className="mt-0.5 text-[11px] text-ink-faint">
                    {mediaById(b.mediaId)?.nama} · {new Date(b.tanggal).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })} · {isuById(b.isuId)?.nama}
                  </p>
                </div>
                <SentimentBadge sentiment={b.sentiment} />
              </button>
            ))}
          </div>
        )}
      </SectionCard>
    </div>
  );
}
