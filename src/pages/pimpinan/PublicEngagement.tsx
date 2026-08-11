import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePimpinanLeader } from '../../lib/usePimpinanLeader';
import { useFilters } from '../../context/FilterContext';
import { SectionCard, EmptyState } from '../../components/ui';
import { sosmedAnggota } from '../../data/medsos';
import { executiveContentByAnggota } from '../../data/executiveContent';
import { pimpinanAktivitasByAnggota } from '../../data/pimpinanAktivitas';
import { filterSosmedAnggota } from '../../lib/filters';
import { filterExecutiveContent, filterAktivitasLike } from '../../lib/pimpinanFilters';
import { topAudienceResponse } from '../../lib/pimpinanAggregations';
import { formatCompact } from '../../lib/aggregations';
import RankedBarList from '../../components/RankedBarList';

export default function PublicEngagement() {
  const { leader } = usePimpinanLeader();
  const { filters } = useFilters();
  const navigate = useNavigate();

  const posts = useMemo(() => filterSosmedAnggota(sosmedAnggota.filter((p) => p.anggotaId === leader.id), filters), [leader, filters]);
  const content = useMemo(() => filterExecutiveContent(executiveContentByAnggota(leader.id), filters), [leader, filters]);
  const aktivitas = useMemo(() => filterAktivitasLike(pimpinanAktivitasByAnggota(leader.id), filters), [leader, filters]);

  const totalViews = posts.reduce((s, p) => s + p.views, 0) + content.reduce((s, c) => s + c.views, 0);
  const totalLikesReactions = posts.reduce((s, p) => s + p.likes, 0);
  const totalComments = posts.reduce((s, p) => s + p.comments, 0);
  const totalShares = posts.reduce((s, p) => s + p.shares, 0);
  const totalEngagement =
    totalLikesReactions + totalComments + totalShares + content.reduce((s, c) => s + c.engagement, 0) + aktivitas.reduce((s, a) => s + a.publicEngagement, 0);
  const avgRate = content.length ? (content.reduce((s, c) => s + c.engagementRate, 0) / content.length).toFixed(1) : '0.0';

  const audience = useMemo(() => topAudienceResponse(leader), [leader]);

  return (
    <div>
      <div className="mb-4">
        <h2 className="text-[15px] font-semibold text-ink">Public Engagement — {leader.nama.split(',')[0]}</h2>
        <p className="text-[12.5px] text-ink-soft">Bagaimana publik merespons aktivitas dan konten pimpinan</p>
      </div>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-5 mb-5">
        <div className="rounded-lg border border-border bg-surface p-4">
          <p className="text-[11px] font-medium uppercase text-ink-faint">Total Engagement</p>
          <p className="mt-1 text-[20px] font-semibold text-ink">{formatCompact(totalEngagement)}</p>
        </div>
        <div className="rounded-lg border border-border bg-surface p-4">
          <p className="text-[11px] font-medium uppercase text-ink-faint">Engagement Rate</p>
          <p className="mt-1 text-[20px] font-semibold text-ink">{avgRate}%</p>
        </div>
        <div className="rounded-lg border border-border bg-surface p-4">
          <p className="text-[11px] font-medium uppercase text-ink-faint">Views</p>
          <p className="mt-1 text-[20px] font-semibold text-ink">{formatCompact(totalViews)}</p>
        </div>
        <div className="rounded-lg border border-border bg-surface p-4">
          <p className="text-[11px] font-medium uppercase text-ink-faint">Comments</p>
          <p className="mt-1 text-[20px] font-semibold text-ink">{formatCompact(totalComments)}</p>
        </div>
        <div className="rounded-lg border border-border bg-surface p-4">
          <p className="text-[11px] font-medium uppercase text-ink-faint">Shares</p>
          <p className="mt-1 text-[20px] font-semibold text-ink">{formatCompact(totalShares)}</p>
        </div>
      </div>

      <SectionCard title="Top Audience Response" description="Isu yang paling mendapatkan perhatian publik — Issue vs Engagement" className="mb-4">
        {audience.length === 0 ? (
          <EmptyState message="Belum ada data engagement per isu." />
        ) : (
          <RankedBarList
            items={audience.map((a) => ({ id: a.isuId, label: a.isu!.nama, value: a.engagement, valueLabel: formatCompact(a.engagement) }))}
            onSelect={(id) => navigate(`/isu-wilayah/${id}`)}
          />
        )}
      </SectionCard>

      <SectionCard title="Aktivitas dengan Respons Publik Tertinggi">
        {aktivitas.length === 0 ? (
          <EmptyState message="Tidak ada aktivitas pada filter saat ini." />
        ) : (
          <div className="space-y-2">
            {[...aktivitas].sort((a, b) => b.publicEngagement - a.publicEngagement).slice(0, 6).map((a) => (
              <div key={a.id} className="flex items-center justify-between rounded-md border border-border p-2.5">
                <p className="truncate text-[12.5px] font-medium text-ink">{a.judul}</p>
                <span className="shrink-0 text-[12px] font-semibold text-ink-soft">{a.publicEngagement.toLocaleString('id-ID')}</span>
              </div>
            ))}
          </div>
        )}
      </SectionCard>
    </div>
  );
}
