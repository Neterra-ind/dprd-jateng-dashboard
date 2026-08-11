import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader, SectionCard, EmptyState, Avatar } from '../components/ui';
import GlobalFilterBar from '../components/GlobalFilterBar';
import { useFilters } from '../context/FilterContext';
import { sosmedInstitution, sosmedAnggota } from '../data/medsos';
import { anggotaList, anggotaById } from '../data/anggota';
import { isuById } from '../data/isuWilayah';
import { filterSosmedAnggota, filterSosmedInstitution } from '../lib/filters';
import { formatCompact } from '../lib/aggregations';
import { hasFullProfile } from '../data/types';
import { SentimentBadge } from '../components/Badges';
import RankedBarList from '../components/RankedBarList';

const platformLabel: Record<string, string> = {
  instagram: 'Instagram',
  facebook: 'Facebook',
  tiktok: 'TikTok',
  youtube: 'YouTube',
  twitter: 'X / Twitter',
};

export default function MediaSosial() {
  const { filters } = useFilters();
  const navigate = useNavigate();

  const instPosts = useMemo(() => filterSosmedInstitution(sosmedInstitution, filters), [filters]);
  const memberPosts = useMemo(() => filterSosmedAnggota(sosmedAnggota, filters), [filters]);

  const instEngagement = instPosts.reduce((s, p) => s + p.likes + p.comments + p.shares, 0);
  const instViews = instPosts.reduce((s, p) => s + p.views, 0);
  const topInstContent = [...instPosts].sort((a, b) => b.likes + b.comments + b.shares - (a.likes + a.comments + a.shares)).slice(0, 4);

  const mostEngaging = useMemo(() => {
    const map = new Map<string, { posts: number; engagement: number; views: number }>();
    for (const p of memberPosts) {
      const cur = map.get(p.anggotaId) ?? { posts: 0, engagement: 0, views: 0 };
      cur.posts += 1;
      cur.engagement += p.likes + p.comments + p.shares;
      cur.views += p.views;
      map.set(p.anggotaId, cur);
    }
    return [...map.entries()]
      .map(([anggotaId, v]) => ({ anggotaId, anggota: anggotaById(anggotaId), ...v }))
      .filter((x) => x.anggota)
      .sort((a, b) => b.engagement - a.engagement) as { anggotaId: string; anggota: NonNullable<ReturnType<typeof anggotaById>>; posts: number; engagement: number; views: number }[];
  }, [memberPosts]);

  return (
    <div>
      <PageHeader
        title="Media Sosial"
        breadcrumb="Institusi & Anggota"
        description="Memantau aktivitas akun resmi DPRD dan anggota di Facebook, Instagram, TikTok, YouTube, dan X/Twitter."
      />

      <GlobalFilterBar show={['periode', 'platform', 'isu', 'anggota', 'sentiment']} />

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4 mb-5">
        <div className="rounded-lg border border-border bg-surface p-4">
          <p className="text-[11px] font-medium uppercase text-ink-faint">Total Posting Institusi</p>
          <p className="mt-1 text-[22px] font-semibold text-ink">{instPosts.length}</p>
        </div>
        <div className="rounded-lg border border-border bg-surface p-4">
          <p className="text-[11px] font-medium uppercase text-ink-faint">Engagement Institusi</p>
          <p className="mt-1 text-[22px] font-semibold text-ink">{formatCompact(instEngagement)}</p>
        </div>
        <div className="rounded-lg border border-border bg-surface p-4">
          <p className="text-[11px] font-medium uppercase text-ink-faint">Views Institusi</p>
          <p className="mt-1 text-[22px] font-semibold text-ink">{formatCompact(instViews)}</p>
        </div>
        <div className="rounded-lg border border-border bg-surface p-4">
          <p className="text-[11px] font-medium uppercase text-ink-faint">Posting Anggota</p>
          <p className="mt-1 text-[22px] font-semibold text-ink">{memberPosts.length}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 mb-4">
        <SectionCard title="Top Content Institusi DPRD" description="Konten dengan engagement tertinggi dari akun resmi">
          {topInstContent.length === 0 ? (
            <EmptyState message="Belum ada konten pada periode ini." />
          ) : (
            <div className="space-y-2.5">
              {topInstContent.map((p) => (
                <div key={p.id} className="rounded-md border border-border p-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-medium uppercase text-ink-faint">{platformLabel[p.platform]} · {p.format}</span>
                    <SentimentBadge sentiment={p.sentiment} />
                  </div>
                  <p className="mt-1 text-[12.5px] text-ink">{p.konten}</p>
                  <p className="mt-1.5 text-[11px] text-ink-faint">
                    {formatCompact(p.views)} views · {formatCompact(p.likes)} suka · {formatCompact(p.comments)} komentar
                  </p>
                </div>
              ))}
            </div>
          )}
        </SectionCard>

        <SectionCard title="Most Engaging Members" description="Anggota dengan engagement media sosial tertinggi">
          {mostEngaging.length === 0 ? (
            <EmptyState message="Belum ada data engagement anggota." />
          ) : (
            <RankedBarList
              items={mostEngaging.slice(0, 8).map((m) => ({
                id: m.anggotaId,
                label: m.anggota.nama,
                value: m.engagement,
                valueLabel: formatCompact(m.engagement),
                sub: `${m.posts} postingan · ${formatCompact(m.views)} views`,
              }))}
              onSelect={(id) => navigate(`/personal/${id}`)}
            />
          )}
        </SectionCard>
      </div>

      <SectionCard title="Aktivitas Media Sosial Anggota" description="Ringkasan performa akun media sosial per anggota">
        <div className="overflow-x-auto -mx-4 lg:-mx-5">
          <table className="w-full min-w-[820px] text-[12.5px]">
            <thead>
              <tr className="border-b border-border text-left text-[11px] uppercase tracking-wide text-ink-faint">
                <th className="px-4 py-2 font-medium lg:px-5">Anggota</th>
                <th className="px-3 py-2 font-medium">Posting</th>
                <th className="px-3 py-2 font-medium">Views</th>
                <th className="px-3 py-2 font-medium">Engagement</th>
                <th className="px-3 py-2 font-medium">Top Issue</th>
              </tr>
            </thead>
            <tbody>
              {anggotaList.filter(hasFullProfile).map((a) => {
                const stat = mostEngaging.find((m) => m.anggotaId === a.id);
                return (
                  <tr key={a.id} onClick={() => navigate(`/personal/${a.id}`)} className="cursor-pointer border-b border-border last:border-0 hover:bg-surface-alt">
                    <td className="px-4 py-2.5 lg:px-5">
                      <div className="flex items-center gap-2.5">
                        <Avatar name={a.nama} src={a.foto} size={28} />
                        <span className="font-medium text-ink">{a.nama}</span>
                      </div>
                    </td>
                    <td className="px-3 py-2.5 text-ink-soft">{stat?.posts ?? 0}</td>
                    <td className="px-3 py-2.5 text-ink-soft">{formatCompact(stat?.views ?? 0)}</td>
                    <td className="px-3 py-2.5 text-ink-soft">{formatCompact(stat?.engagement ?? 0)}</td>
                    <td className="px-3 py-2.5 text-ink-soft">{isuById(a.topIssueIds?.[0])?.nama ?? '—'}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </SectionCard>
    </div>
  );
}
