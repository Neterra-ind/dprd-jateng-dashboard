import { useMemo } from 'react';
import { Camera, Users, Video, AtSign, Music2, Globe, Rss, MessageCircle, Mic2, Sparkles } from 'lucide-react';
import { usePimpinanLeader } from '../../lib/usePimpinanLeader';
import { useFilters } from '../../context/FilterContext';
import { SectionCard } from '../../components/ui';
import { digitalAssetsByAnggota } from '../../data/digitalAssets';
import { filterDigitalAssets } from '../../lib/pimpinanFilters';
import { digitalAssetHealth, digitalAssetVsPersonalIssue, crossPlatformConsistency } from '../../lib/pimpinanAggregations';
import type { DigitalAssetStatus, DigitalPlatform } from '../../data';

const platformMeta: Record<DigitalPlatform, { label: string; icon: React.ComponentType<{ size?: number }> }> = {
  instagram: { label: 'Instagram', icon: Camera },
  facebook: { label: 'Facebook', icon: Users },
  tiktok: { label: 'TikTok', icon: Music2 },
  youtube: { label: 'YouTube', icon: Video },
  twitter: { label: 'X / Twitter', icon: AtSign },
  website: { label: 'Website Pribadi', icon: Globe },
  blog: { label: 'Blog', icon: Rss },
  whatsapp: { label: 'Kanal WhatsApp', icon: MessageCircle },
  podcast: { label: 'Podcast', icon: Mic2 },
};

const statusMeta: Record<DigitalAssetStatus, { label: string; className: string }> = {
  active: { label: 'Active', className: 'bg-[var(--color-positive-soft)] text-[var(--color-positive)]' },
  low_activity: { label: 'Low Activity', className: 'bg-[var(--color-neutral-soft)] text-[var(--color-neutral)]' },
  not_detected: { label: 'Not Detected', className: 'bg-surface-alt text-ink-faint' },
  not_configured: { label: 'Not Configured', className: 'bg-surface-alt text-ink-faint' },
};

export default function DigitalAssets() {
  const { leader } = usePimpinanLeader();
  const { filters } = useFilters();

  const assets = useMemo(() => digitalAssetsByAnggota(leader.id), [leader]);
  const filtered = useMemo(() => filterDigitalAssets(assets, filters), [assets, filters]);
  const health = useMemo(() => digitalAssetHealth(assets), [assets]);
  const vsIssue = useMemo(() => digitalAssetVsPersonalIssue(leader.id), [leader]);
  const consistency = useMemo(() => crossPlatformConsistency(assets), [assets]);
  const activeCount = assets.filter((a) => a.status === 'active').length;
  const lowCount = assets.filter((a) => a.status === 'low_activity').length;
  const missingCount = assets.filter((a) => a.status === 'not_detected' || a.status === 'not_configured').length;

  return (
    <div>
      <div className="mb-4">
        <h2 className="text-[15px] font-semibold text-ink">Personal Digital Assets — {leader.nama.split(',')[0]}</h2>
        <p className="text-[12.5px] text-ink-soft">Pemetaan seluruh kehadiran digital publik milik pimpinan</p>
      </div>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4 mb-4">
        <div className="rounded-lg border border-border bg-surface p-4">
          <p className="text-[11px] font-medium uppercase text-ink-faint">Active</p>
          <p className="mt-1 text-[22px] font-semibold" style={{ color: 'var(--color-positive)' }}>{activeCount}</p>
        </div>
        <div className="rounded-lg border border-border bg-surface p-4">
          <p className="text-[11px] font-medium uppercase text-ink-faint">Low Activity</p>
          <p className="mt-1 text-[22px] font-semibold" style={{ color: 'var(--color-neutral)' }}>{lowCount}</p>
        </div>
        <div className="rounded-lg border border-border bg-surface p-4">
          <p className="text-[11px] font-medium uppercase text-ink-faint">Belum Terdeteksi</p>
          <p className="mt-1 text-[22px] font-semibold text-ink-faint">{missingCount}</p>
        </div>
        <div className="rounded-lg border border-border bg-surface p-4">
          <div className="flex items-center gap-1.5">
            <p className="text-[11px] font-medium uppercase text-ink-faint">Asset Health</p>
            <span className="rounded bg-brand-soft px-1 py-0.5 text-[9px] font-semibold text-brand">ANALYTICAL SCORE</span>
          </div>
          <p className="mt-1 text-[22px] font-semibold text-ink">{health.score}<span className="text-[12px] text-ink-faint"> · {health.status}</span></p>
        </div>
      </div>

      <SectionCard title="Digital Asset Inventory" description="Status akun publik dan performa masing-masing kanal — DEMO DATA">
        <div className="overflow-x-auto -mx-4 lg:-mx-5">
          <table className="w-full min-w-[820px] text-[12.5px]">
            <thead>
              <tr className="border-b border-border text-left text-[11px] uppercase tracking-wide text-ink-faint">
                <th className="px-4 py-2 font-medium lg:px-5">Platform</th>
                <th className="px-3 py-2 font-medium">Status</th>
                <th className="px-3 py-2 font-medium">Followers</th>
                <th className="px-3 py-2 font-medium">Activity</th>
                <th className="px-3 py-2 font-medium">Engagement</th>
                <th className="px-3 py-2 font-medium">Last Activity</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((a) => {
                const meta = platformMeta[a.platform];
                const status = statusMeta[a.status];
                const isConfigured = a.status === 'active' || a.status === 'low_activity';
                return (
                  <tr key={a.id} className="border-b border-border last:border-0">
                    <td className="px-4 py-2.5 lg:px-5">
                      <div className="flex items-center gap-2 font-medium text-ink">
                        <meta.icon size={15} />
                        {meta.label}
                      </div>
                    </td>
                    <td className="px-3 py-2.5">
                      <span className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${status.className}`}>{status.label}</span>
                    </td>
                    <td className="px-3 py-2.5 text-ink-soft">
                      {isConfigured ? (a.followers ? `${a.followers.toLocaleString('id-ID')} followers` : (a.metricLabel ?? '—')) : '—'}
                    </td>
                    <td className="px-3 py-2.5 text-ink-soft">
                      {isConfigured && a.activityPerMonth ? `${a.activityPerMonth} ${a.activityLabel ?? ''}` : '—'}
                    </td>
                    <td className="px-3 py-2.5 text-ink-soft">{isConfigured && a.engagementRate ? `${a.engagementRate}%` : '—'}</td>
                    <td className="px-3 py-2.5 text-ink-soft">
                      {isConfigured && a.lastActivityDaysAgo !== undefined ? `${a.lastActivityDaysAgo} hari lalu` : 'Data not available'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </SectionCard>

      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <SectionCard
          title="Digital Asset vs Personal Issue"
          description="Isu dominan dan tingkat engagement pada masing-masing kanal"
          action={
            <span className="flex items-center gap-1 rounded-full bg-brand-soft px-2.5 py-0.5 text-[10.5px] font-semibold text-brand">
              <Sparkles size={11} /> AI-derived insight
            </span>
          }
        >
          {vsIssue.length === 0 ? (
            <p className="text-[12px] text-ink-faint">Belum cukup data untuk analisis ini.</p>
          ) : (
            <div className="space-y-2.5">
              {vsIssue.map((v) => (
                <div key={v.platform} className="flex items-center justify-between rounded-md border border-border p-2.5">
                  <div className="min-w-0">
                    <p className="text-[12.5px] font-medium text-ink capitalize">{v.platform}</p>
                    <p className="truncate text-[11.5px] text-ink-faint">{v.isu?.nama}</p>
                  </div>
                  <span
                    className="shrink-0 rounded-full px-2 py-0.5 text-[11px] font-semibold"
                    style={{
                      background: v.engagementLevel === 'High' ? 'var(--color-positive-soft)' : v.engagementLevel === 'Medium' ? 'var(--color-neutral-soft)' : 'var(--color-surface-alt)',
                      color: v.engagementLevel === 'High' ? 'var(--color-positive)' : v.engagementLevel === 'Medium' ? 'var(--color-neutral)' : 'var(--color-ink-faint)',
                    }}
                  >
                    {v.engagementLevel}
                  </span>
                </div>
              ))}
              {vsIssue[0] && (
                <p className="mt-2 text-[12px] text-ink-soft">
                  &ldquo;Isu {vsIssue[0].isu?.nama} memiliki engagement digital tertinggi dibandingkan isu lainnya.&rdquo;
                </p>
              )}
            </div>
          )}
        </SectionCard>

        <SectionCard title="Narrative Consistency" description="Konsistensi narasi isu antarplatform">
          <div className="flex items-center gap-2 mb-3">
            <span className="rounded-full bg-brand-soft px-2.5 py-0.5 text-[11.5px] font-semibold text-brand">{consistency.status}</span>
          </div>
          {consistency.breakdown.length > 0 && (
            <div className="mb-3 space-y-1.5">
              {consistency.breakdown.map((b, idx) => (
                <div key={idx} className="flex items-center justify-between text-[12px]">
                  <span className="capitalize text-ink-soft">{b.platform}</span>
                  <span className="font-medium text-ink">{b.isuNama}</span>
                </div>
              ))}
            </div>
          )}
          <p className="text-[12px] text-ink-soft">{consistency.narrative}</p>
        </SectionCard>
      </div>
    </div>
  );
}
