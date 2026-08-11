import { useMemo, useState } from 'react';
import { Sparkles } from 'lucide-react';
import { usePimpinanLeader } from '../../lib/usePimpinanLeader';
import { useFilters } from '../../context/FilterContext';
import { SectionCard, EmptyState } from '../../components/ui';
import { SentimentBadge } from '../../components/Badges';
import { digitalAssetsByAnggota } from '../../data/digitalAssets';
import { filterExecutiveContent } from '../../lib/pimpinanFilters';
import { executiveContentByAnggota } from '../../data/executiveContent';
import { engagementTrendSeries, contentIssueMatrixData } from '../../lib/pimpinanAggregations';
import TrendLineChart from '../../components/charts/TrendLineChart';
import ContentIssueMatrix from '../../components/charts/ContentIssueMatrix';

const platformLabel: Record<string, string> = {
  instagram: 'Instagram', facebook: 'Facebook', tiktok: 'TikTok', youtube: 'YouTube', twitter: 'X / Twitter', website: 'Website',
};

export default function DigitalPerformance() {
  const { leader } = usePimpinanLeader();
  const { filters } = useFilters();

  const assets = useMemo(
    () => digitalAssetsByAnggota(leader.id).filter((a) => (a.status === 'active' || a.status === 'low_activity') && a.growth),
    [leader]
  );
  const [platformId, setPlatformId] = useState(assets[0]?.id);
  const activeAsset = assets.find((a) => a.id === platformId) ?? assets[0];

  const content = useMemo(() => filterExecutiveContent(executiveContentByAnggota(leader.id), filters), [leader, filters]);
  const matrix = useMemo(() => contentIssueMatrixData(leader.id), [leader]);

  const engagementTrend = activeAsset ? engagementTrendSeries(activeAsset) : [];

  return (
    <div>
      <div className="mb-4">
        <h2 className="text-[15px] font-semibold text-ink">Digital Performance — {leader.nama.split(',')[0]}</h2>
        <p className="text-[12.5px] text-ink-soft">Analisis pertumbuhan follower, engagement, dan performa konten lintas platform</p>
      </div>

      {assets.length === 0 ? (
        <EmptyState message="Belum ada aset digital aktif untuk dianalisis." />
      ) : (
        <>
          <div className="mb-3 flex flex-wrap gap-1.5">
            {assets.map((a) => (
              <button
                key={a.id}
                onClick={() => setPlatformId(a.id)}
                className={`rounded-md px-3 py-1.5 text-[12.5px] font-medium ${
                  a.id === activeAsset?.id ? 'bg-brand text-white' : 'border border-border bg-surface text-ink-soft hover:bg-surface-alt'
                }`}
              >
                {platformLabel[a.platform] ?? a.platform}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 mb-4">
            <SectionCard title="Follower Growth" description={`${platformLabel[activeAsset?.platform ?? ''] ?? ''} · 6 bulan terakhir`}>
              <TrendLineChart data={activeAsset?.growth ?? []} valueLabel="Followers" color="var(--color-brand)" />
            </SectionCard>
            <SectionCard title="Engagement Trend" description="Estimasi engagement rate bulanan">
              <TrendLineChart data={engagementTrend} valueLabel="Engagement Rate (%)" color="var(--color-positive)" />
            </SectionCard>
          </div>
        </>
      )}

      <SectionCard
        title="Top Performing Content"
        description="Konten dengan performa terbaik pada periode terpilih"
        action={
          <span className="flex items-center gap-1 rounded-full bg-brand-soft px-2.5 py-0.5 text-[10.5px] font-semibold text-brand">
            <Sparkles size={11} /> AI-derived analysis
          </span>
        }
        className="mb-4"
      >
        {content.length === 0 ? (
          <EmptyState message="Tidak ada konten pada filter saat ini." />
        ) : (
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            {content.slice(0, 6).map((c) => (
              <div key={c.id} className="rounded-md border border-border p-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-medium uppercase text-ink-faint">{platformLabel[c.platform] ?? c.platform} · {c.format}</span>
                  <SentimentBadge sentiment={c.sentiment} />
                </div>
                <p className="mt-1.5 text-[13px] font-medium text-ink">{c.topik}</p>
                <div className="mt-2 grid grid-cols-3 gap-2 text-center">
                  <div>
                    <p className="text-[13px] font-semibold text-ink">{(c.views / 1000).toFixed(0)}K</p>
                    <p className="text-[10px] text-ink-faint">Views</p>
                  </div>
                  <div>
                    <p className="text-[13px] font-semibold text-ink">{c.engagement.toLocaleString('id-ID')}</p>
                    <p className="text-[10px] text-ink-faint">Engagement</p>
                  </div>
                  <div>
                    <p className="text-[13px] font-semibold text-ink">{c.engagementRate}%</p>
                    <p className="text-[10px] text-ink-faint">Rate</p>
                  </div>
                </div>
                <div className="mt-2.5 rounded-md bg-surface-alt p-2">
                  <p className="text-[10.5px] font-semibold uppercase text-ink-faint">Why It Performed</p>
                  <p className="mt-0.5 text-[11.5px] text-ink-soft">{c.whyItPerformed}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </SectionCard>

      <SectionCard title="Content / Issue Matrix" description="Sumbu X: Public Engagement · Sumbu Y: Strategic Relevance">
        {matrix.length === 0 ? <EmptyState message="Belum ada data konten." /> : <ContentIssueMatrix data={matrix} />}
      </SectionCard>
    </div>
  );
}
