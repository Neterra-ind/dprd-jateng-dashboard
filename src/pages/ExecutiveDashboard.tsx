import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader, SectionCard, KPICard } from '../components/ui';
import GlobalFilterBar from '../components/GlobalFilterBar';
import { useFilters } from '../context/FilterContext';
import { beritaList, isuWilayahList, anggotaList } from '../data';
import { sosmedInstitution, sosmedAnggota } from '../data/medsos';
import { filterBerita, filterIsu } from '../lib/filters';
import {
  computeExecutiveKPIs,
  topIssuesByVolume,
  topMediaByVolume,
  topAnggotaByEkspos,
  topPersonalIssues,
  sentimentDistribution,
  weeklyTrendSeries,
  formatCompact,
} from '../lib/aggregations';
import TrendLineChart from '../components/charts/TrendLineChart';
import SentimentDonut from '../components/charts/SentimentDonut';
import RankedBarList from '../components/RankedBarList';
import StrategicAttentionPanel from '../components/StrategicAttentionPanel';
import { TrendTag } from '../components/Badges';

export default function ExecutiveDashboard() {
  const { filters } = useFilters();
  const navigate = useNavigate();

  const filteredBerita = useMemo(() => filterBerita(beritaList, filters), [filters]);
  const filteredIsu = useMemo(() => filterIsu(isuWilayahList, filters), [filters]);

  const kpi = useMemo(
    () => computeExecutiveKPIs(filteredBerita, filteredIsu, sosmedInstitution, sosmedAnggota),
    [filteredBerita, filteredIsu]
  );
  const trend = useMemo(() => weeklyTrendSeries(filteredBerita), [filteredBerita]);
  const sentiment = useMemo(() => sentimentDistribution(filteredBerita), [filteredBerita]);
  const topIsu = useMemo(() => topIssuesByVolume(filteredIsu, 10), [filteredIsu]);
  const topMedia = useMemo(() => topMediaByVolume(filteredBerita, 8), [filteredBerita]);
  const topAnggota = useMemo(() => topAnggotaByEkspos(filteredBerita, 8), [filteredBerita]);
  const topPersonal = useMemo(() => topPersonalIssues(anggotaList, 8), []);
  const isuStrategis = useMemo(() => filteredIsu.filter((i) => i.strategic), [filteredIsu]);

  return (
    <div>
      <PageHeader
        title="Executive Dashboard"
        breadcrumb="Ringkasan"
        description="Ringkasan kondisi wilayah, kinerja DPRD, dan reputasi publik dalam satu tampilan bagi pimpinan dan pengambil keputusan."
      />

      <GlobalFilterBar show={['periode', 'wilayah', 'komisi', 'isu']} />

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4 mb-5">
        <KPICard label="Total Ekspos DPRD" value={kpi.totalEksposDprd.toLocaleString('id-ID')} sub="berita menyebut anggota/komisi" />
        <KPICard label="Ekspos Positif" value={kpi.eksposPositif.toLocaleString('id-ID')} accent="positive" />
        <KPICard label="Ekspos Negatif" value={kpi.eksposNegatif.toLocaleString('id-ID')} accent="negative" />
        <KPICard label="Total Isu Wilayah" value={kpi.totalIsuWilayah.toString()} sub="isu dipantau saat ini" />
        <KPICard label="Isu Strategis" value={kpi.isuStrategis.toString()} accent="brand" />
        <KPICard label="Isu Negatif" value={kpi.isuNegatif.toString()} accent="negative" />
        <KPICard label="Social Media Engagement" value={formatCompact(kpi.socialEngagement)} sub="like + komentar + share" />
        <KPICard label="Share of Voice DPRD" value={`${kpi.shareOfVoice}%`} sub="dari total pemberitaan wilayah" />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 mb-4">
        <SectionCard title="Trend Ekspos Media" description="Volume pemberitaan mingguan, garis putus-putus menunjukkan porsi negatif" className="lg:col-span-2">
          <TrendLineChart data={trend} valueLabel="Total Berita" secondaryLabel="Berita Negatif" />
        </SectionCard>
        <SectionCard title="Distribusi Sentimen" description="Seluruh pemberitaan pada periode terpilih">
          <div className="flex h-[220px] items-center justify-center">
            <SentimentDonut positive={sentiment.positive} neutral={sentiment.neutral} negative={sentiment.negative} />
          </div>
        </SectionCard>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 mb-4">
        <SectionCard title="Top 10 Isu Wilayah" description="Berdasarkan volume pemberitaan">
          <RankedBarList
            items={topIsu.map((i) => ({ id: i.id, label: i.nama, value: i.volume, sub: i.kategori }))}
            onSelect={(id) => navigate(`/isu-wilayah/${id}`)}
          />
        </SectionCard>
        <SectionCard title="Top Media" description="Media dengan jumlah pemberitaan terbanyak">
          <RankedBarList items={topMedia.map((m) => ({ id: m.mediaId, label: m.nama, value: m.count }))} />
        </SectionCard>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 mb-4">
        <SectionCard title="Top Anggota DPRD Berdasarkan Ekspos" description="Jumlah pemberitaan yang menyebut anggota">
          <RankedBarList
            items={topAnggota.map((a) => ({ id: a.anggotaId, label: a.anggota.nama, value: a.count, sub: a.anggota.jabatan }))}
            onSelect={(id) => navigate(`/personal/${id}`)}
          />
        </SectionCard>
        <SectionCard title="Top Personal Issues" description="Isu yang paling melekat pada anggota DPRD, tertimbang eksposur">
          <RankedBarList
            items={topPersonal.map((p) => ({ id: p.isuId, label: p.isu.nama, value: p.weight, valueLabel: undefined }))}
            onSelect={(id) => navigate(`/isu-wilayah/${id}`)}
          />
        </SectionCard>
      </div>

      <SectionCard title="Strategic Attention" description="Sinyal yang membutuhkan perhatian pimpinan dan alat kelengkapan DPRD" className="mb-4">
        <StrategicAttentionPanel isuList={filteredIsu} onSelect={(id) => navigate(`/isu-wilayah/${id}`)} />
      </SectionCard>

      {isuStrategis.length > 0 && (
        <SectionCard title="Isu Strategis" description="Isu dengan bobot kebijakan dan eksposur tertinggi saat ini">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
            {isuStrategis.map((isu) => (
              <button
                key={isu.id}
                onClick={() => navigate(`/isu-wilayah/${isu.id}`)}
                className="rounded-md border border-border p-3 text-left hover:border-brand-light hover:bg-brand-soft/40"
              >
                <div className="flex items-start justify-between gap-2">
                  <p className="text-[13px] font-semibold text-ink">{isu.nama}</p>
                  <TrendTag value={isu.trend} />
                </div>
                <p className="mt-1 line-clamp-2 text-[12px] text-ink-soft">{isu.ringkasan}</p>
              </button>
            ))}
          </div>
        </SectionCard>
      )}
    </div>
  );
}
