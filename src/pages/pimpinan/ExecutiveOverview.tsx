import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles } from 'lucide-react';
import { usePimpinanLeader } from '../../lib/usePimpinanLeader';
import { useFilters } from '../../context/FilterContext';
import { SectionCard } from '../../components/ui';
import { DemoDataTag } from '../../components/Badges';
import {
  computePimpinanKPIs,
  activityByCategory,
  digitalAssetHealth,
  topAudienceResponse,
} from '../../lib/pimpinanAggregations';
import { issueWeightBreakdown } from '../../lib/aggregations';
import { pimpinanAktivitasByAnggota } from '../../data/pimpinanAktivitas';
import { digitalAssetsByAnggota } from '../../data/digitalAssets';
import { executiveContentByAnggota } from '../../data/executiveContent';
import { executiveAttentionByAnggota } from '../../data/executiveAttention';
import RankedBarList from '../../components/RankedBarList';
import SimpleBarChart from '../../components/charts/SimpleBarChart';
import { activityMonthlySeries } from '../../lib/pimpinanAggregations';
import { RiskLevelBadge } from '../../components/Badges';

const tierMeta = {
  high_attention: { emoji: '🔴', label: 'HIGH ATTENTION' },
  watch: { emoji: '🟡', label: 'WATCH' },
  opportunity: { emoji: '🟢', label: 'OPPORTUNITY' },
  digital_asset: { emoji: '🔵', label: 'DIGITAL ASSET' },
};

export default function ExecutiveOverview() {
  const { leader } = usePimpinanLeader();
  const { filters } = useFilters();
  const navigate = useNavigate();

  const aktivitas = useMemo(() => pimpinanAktivitasByAnggota(leader.id), [leader]);
  const kpi = useMemo(() => computePimpinanKPIs(leader, filters.periode), [leader, filters.periode]);
  const categories = useMemo(() => activityByCategory(aktivitas), [aktivitas]);
  const monthly = useMemo(() => activityMonthlySeries(aktivitas), [aktivitas]);
  const assets = useMemo(() => digitalAssetsByAnggota(leader.id), [leader]);
  const health = useMemo(() => digitalAssetHealth(assets), [assets]);
  const breakdown = useMemo(() => issueWeightBreakdown(leader), [leader]);
  const topContent = useMemo(
    () => [...executiveContentByAnggota(leader.id)].sort((a, b) => b.engagement - a.engagement)[0],
    [leader]
  );
  const attention = useMemo(() => executiveAttentionByAnggota(leader.id).slice(0, 6), [leader]);
  const audience = useMemo(() => topAudienceResponse(leader).slice(0, 5), [leader]);

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-[15px] font-semibold text-ink">Executive Overview — {leader.nama}</h2>
          <p className="text-[12.5px] text-ink-soft">Ringkasan performa eksekutif dan aset digital pribadi</p>
        </div>
        <DemoDataTag />
      </div>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4 mb-5">
        <div className="rounded-lg border border-border bg-surface p-4">
          <p className="text-[11px] font-medium uppercase text-ink-faint">Executive Exposure</p>
          <p className="mt-1 text-[24px] font-semibold text-ink">{kpi.executiveExposure}</p>
        </div>
        <div className="rounded-lg border border-border bg-surface p-4">
          <p className="text-[11px] font-medium uppercase text-ink-faint">Performance Activity</p>
          <p className="mt-1 text-[24px] font-semibold text-ink">{kpi.performanceActivity}</p>
        </div>
        <div className="rounded-lg border border-border bg-surface p-4">
          <p className="text-[11px] font-medium uppercase text-ink-faint">Strategic Issues</p>
          <p className="mt-1 text-[24px] font-semibold text-ink">{kpi.strategicIssues}</p>
        </div>
        <div className="rounded-lg border border-border bg-surface p-4">
          <p className="text-[11px] font-medium uppercase text-ink-faint">Public Engagement</p>
          <p className="mt-1 text-[24px] font-semibold text-ink">{kpi.publicEngagementLabel}</p>
        </div>
        <div className="rounded-lg border border-border bg-surface p-4">
          <p className="text-[11px] font-medium uppercase text-ink-faint">Digital Assets</p>
          <p className="mt-1 text-[24px] font-semibold text-ink">{kpi.digitalAssets}</p>
        </div>
        <div className="rounded-lg border border-border bg-surface p-4">
          <p className="text-[11px] font-medium uppercase text-ink-faint">Digital Reach</p>
          <p className="mt-1 text-[24px] font-semibold text-ink">{kpi.digitalReachLabel}</p>
        </div>
        <div className="rounded-lg border border-border bg-surface p-4">
          <div className="flex items-center gap-1.5">
            <p className="text-[11px] font-medium uppercase text-ink-faint">Reputation</p>
            <span className="rounded bg-brand-soft px-1 py-0.5 text-[9px] font-semibold text-brand">SCORE</span>
          </div>
          <p className="mt-1 text-[24px] font-semibold text-ink">{kpi.reputation}<span className="text-[13px] text-ink-faint">/100</span></p>
        </div>
        <div className="rounded-lg border border-border bg-surface p-4">
          <div className="flex items-center gap-1.5">
            <p className="text-[11px] font-medium uppercase text-ink-faint">Digital Risk</p>
            <span className="rounded bg-brand-soft px-1 py-0.5 text-[9px] font-semibold text-brand">SCORE</span>
          </div>
          <div className="mt-1.5"><RiskLevelBadge level={kpi.digitalRisk} /></div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 mb-4">
        <SectionCard
          title="Executive Performance"
          description="Activity & Visibility Analysis 6 bulan terakhir"
          action={<button onClick={() => navigate(`/pimpinan/kinerja?leader=${leader.id}`)} className="text-[12px] font-medium text-brand hover:underline">Detail →</button>}
          className="lg:col-span-2"
        >
          <SimpleBarChart data={monthly} height={180} />
          <div className="mt-3 grid grid-cols-5 gap-2">
            {categories.map((c) => (
              <div key={c.fungsi} className="rounded-md bg-surface-alt p-2 text-center">
                <p className="text-[15px] font-semibold text-ink">{c.value}</p>
                <p className="text-[10px] text-ink-faint leading-tight">{c.label}</p>
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard
          title="Digital Assets"
          description="Asset Health — Analytical Score"
          action={<button onClick={() => navigate(`/pimpinan/digital-assets?leader=${leader.id}`)} className="text-[12px] font-medium text-brand hover:underline">Detail →</button>}
        >
          <div className="flex items-center justify-center py-3">
            <div className="text-center">
              <p className="text-[38px] font-semibold text-ink">{health.score}</p>
              <p className="text-[11px] text-ink-faint">/100 · {health.status}</p>
            </div>
          </div>
          <p className="text-center text-[11.5px] text-ink-soft">{assets.filter((a) => a.status === 'active' || a.status === 'low_activity').length} dari {assets.length} kanal terpantau aktif</p>
        </SectionCard>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 mb-4">
        <SectionCard
          title="Personal Issue"
          description="Top Issues & Positioning"
          action={<button onClick={() => navigate(`/pimpinan/personal-issues?leader=${leader.id}`)} className="text-[12px] font-medium text-brand hover:underline">Detail →</button>}
        >
          <div className="space-y-2">
            {breakdown.slice(0, 4).map((b) => (
              <div key={b.isuId} className="flex items-center justify-between text-[12.5px]">
                <span className="truncate text-ink">{b.isu?.nama}</span>
                <span className="font-semibold text-ink-soft">{b.pct}%</span>
              </div>
            ))}
          </div>
          <p className="mt-3 text-[11.5px] italic text-ink-soft line-clamp-2">&ldquo;{leader.positioning}&rdquo;</p>
        </SectionCard>

        <SectionCard
          title="Public Engagement"
          description="Top Audience Response"
          action={<button onClick={() => navigate(`/pimpinan/public-engagement?leader=${leader.id}`)} className="text-[12px] font-medium text-brand hover:underline">Detail →</button>}
        >
          <RankedBarList items={audience.map((a) => ({ id: a.isuId, label: a.isu!.nama, value: a.engagement }))} />
        </SectionCard>

        <SectionCard
          title="Top Content"
          description="Konten berkinerja terbaik"
          action={<button onClick={() => navigate(`/pimpinan/digital-performance?leader=${leader.id}`)} className="text-[12px] font-medium text-brand hover:underline">Detail →</button>}
        >
          {topContent ? (
            <div>
              <p className="text-[11px] uppercase text-ink-faint">{topContent.platform} · {topContent.format}</p>
              <p className="mt-1 text-[13px] font-medium text-ink">{topContent.topik}</p>
              <p className="mt-1.5 text-[11.5px] text-ink-faint">
                {topContent.views.toLocaleString('id-ID')} views · {topContent.engagementRate}% engagement rate
              </p>
            </div>
          ) : (
            <p className="text-[12px] text-ink-faint">Belum ada data konten.</p>
          )}
        </SectionCard>
      </div>

      <SectionCard
        title="Executive Attention"
        description="5–7 insight paling penting bagi pimpinan"
        action={
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1 rounded-full bg-brand-soft px-2.5 py-0.5 text-[10.5px] font-semibold text-brand">
              <Sparkles size={11} /> AI-derived insight
            </span>
            <button onClick={() => navigate(`/pimpinan/strategic-attention?leader=${leader.id}`)} className="text-[12px] font-medium text-brand hover:underline">Detail →</button>
          </div>
        }
      >
        <div className="grid grid-cols-1 gap-2.5 md:grid-cols-2">
          {attention.map((a) => (
            <div key={a.id} className="rounded-md border border-border p-3">
              <p className="text-[11px] font-semibold text-ink-faint">
                {tierMeta[a.tier].emoji} {tierMeta[a.tier].label}
              </p>
              <p className="mt-1 text-[12.5px] font-medium text-ink">{a.issue}</p>
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}
