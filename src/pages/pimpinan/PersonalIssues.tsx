import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles } from 'lucide-react';
import { usePimpinanLeader } from '../../lib/usePimpinanLeader';
import { SectionCard, ProgressBar } from '../../components/ui';
import { issueWeightBreakdown } from '../../lib/aggregations';
import { issueConsistency, personalPositioningIndicators } from '../../lib/pimpinanAggregations';
import { beritaList } from '../../data/berita';
import { mediaById } from '../../data/media';
import { opdById } from '../../data/opd';
import { komisiById } from '../../data/komisi';
import { SentimentBadge, TrendTag } from '../../components/Badges';

export default function PersonalIssues() {
  const { leader } = usePimpinanLeader();
  const navigate = useNavigate();

  const breakdown = useMemo(() => issueWeightBreakdown(leader), [leader]);
  const consistency = useMemo(() => issueConsistency(leader), [leader]);
  const indicators = useMemo(() => personalPositioningIndicators(leader), [leader]);
  const leaderBerita = useMemo(() => beritaList.filter((b) => b.anggotaIds.includes(leader.id)), [leader]);
  const dominantIssue = breakdown[0]?.isu;
  const relatedOpd = dominantIssue ? opdById(dominantIssue.opdIds[0]) : undefined;
  const komisi = komisiById(leader.komisiId);

  return (
    <div>
      <div className="mb-4">
        <h2 className="text-[15px] font-semibold text-ink">Personal Issue Intelligence — {leader.nama.split(',')[0]}</h2>
        <p className="text-[12.5px] text-ink-soft">Isu yang paling sering dikaitkan dengan pimpinan, beserta positioning yang terbentuk</p>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 mb-4">
        <SectionCard title="Top Personal Issues" description="Bobot isu berdasarkan volume ekspos yang tertimbang">
          <div className="space-y-3">
            {breakdown.map((b, idx) => {
              const relatedNews = leaderBerita.filter((n) => n.isuId === b.isuId);
              const statement = relatedNews.find((n) => n.pernyataan);
              return (
                <button key={b.isuId} onClick={() => navigate(`/isu-wilayah/${b.isuId}`)} className="block w-full text-left rounded-md border border-border p-3 hover:border-brand-light">
                  <div className="flex items-center justify-between text-[13px] mb-1">
                    <span className="font-semibold text-ink">{idx + 1}. {b.isu?.nama}</span>
                    <span className="font-semibold text-brand">{b.pct}%</span>
                  </div>
                  <ProgressBar value={b.pct} />
                  <div className="mt-2 flex flex-wrap items-center gap-2 text-[11.5px] text-ink-faint">
                    <span>{b.isu?.volume.toLocaleString('id-ID')} berita</span>
                    <TrendTag value={b.isu?.trend ?? 0} />
                    {b.isu && <SentimentBadge sentiment={b.isu.sentiment} />}
                    {relatedNews[0] && <span>{mediaById(relatedNews[0].mediaId)?.nama}</span>}
                  </div>
                  {statement?.pernyataan && <p className="mt-1.5 text-[11.5px] italic text-ink-soft line-clamp-2">&ldquo;{statement.pernyataan}&rdquo;</p>}
                </button>
              );
            })}
          </div>
        </SectionCard>

        <SectionCard
          title="Issue Consistency"
          description="Konsistensi pimpinan dalam membawa isu dari waktu ke waktu"
          action={
            <span className="flex items-center gap-1 rounded-full bg-brand-soft px-2.5 py-0.5 text-[10.5px] font-semibold text-brand">
              <Sparkles size={11} /> AI-derived analysis
            </span>
          }
        >
          <div className="space-y-3">
            {consistency.map((c) => (
              <div key={c.isuId}>
                <div className="flex items-center justify-between text-[12.5px] mb-1">
                  <span className="font-medium text-ink">{c.isu?.nama}</span>
                  <span className="font-semibold text-ink-soft">{c.pct}%</span>
                </div>
                <ProgressBar value={c.pct} colorVar="var(--color-brand-light)" />
              </div>
            ))}
          </div>
        </SectionCard>
      </div>

      <SectionCard
        title="Personal Positioning"
        description="Bagaimana pimpinan diposisikan berdasarkan isu dan narasinya"
        action={
          <span className="flex items-center gap-1 rounded-full bg-brand-soft px-2.5 py-0.5 text-[10.5px] font-semibold text-brand">
            <Sparkles size={11} /> AI-derived positioning
          </span>
        }
        className="mb-4"
      >
        <p className="text-[15px] font-medium italic text-ink">&ldquo;{leader.positioning}&rdquo;</p>

        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            { label: 'Positioning Strength', value: indicators.positioningStrength },
            { label: 'Issue Consistency', value: indicators.issueConsistency },
            { label: 'Media Visibility', value: indicators.mediaVisibility },
            { label: 'Public Engagement', value: indicators.publicEngagement },
          ].map((i) => (
            <div key={i.label} className="rounded-md border border-border p-3 text-center">
              <p className="text-[18px] font-semibold text-ink">{i.value}<span className="text-[12px] text-ink-faint">/100</span></p>
              <p className="mt-1 text-[10.5px] uppercase text-ink-faint leading-tight">{i.label}</p>
            </div>
          ))}
        </div>

        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3 text-[12.5px]">
          <div>
            <p className="text-ink-faint">Isu Utama</p>
            <p className="font-medium text-ink">{dominantIssue?.nama ?? '—'}</p>
          </div>
          <div>
            <p className="text-ink-faint">Pihak Sering Dikritik</p>
            <p className="font-medium text-ink">{relatedOpd?.singkatan ?? '—'}</p>
          </div>
          <div>
            <p className="text-ink-faint">Pihak Sering Didukung</p>
            <p className="font-medium text-ink">{komisi?.nama ?? '—'}</p>
          </div>
        </div>
      </SectionCard>
    </div>
  );
}
