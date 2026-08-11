import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles } from 'lucide-react';
import { usePimpinanLeader } from '../../lib/usePimpinanLeader';
import { EmptyState } from '../../components/ui';
import { executiveAttentionByAnggota } from '../../data/executiveAttention';
import type { AttentionTier } from '../../data';

const tierMeta: Record<AttentionTier, { emoji: string; label: string }> = {
  high_attention: { emoji: '🔴', label: 'HIGH ATTENTION' },
  watch: { emoji: '🟡', label: 'WATCH' },
  opportunity: { emoji: '🟢', label: 'OPPORTUNITY' },
  digital_asset: { emoji: '🔵', label: 'DIGITAL ASSET' },
};

const tierBorderColor: Record<AttentionTier, string> = {
  high_attention: 'var(--color-negative)',
  watch: 'var(--color-neutral)',
  opportunity: 'var(--color-positive)',
  digital_asset: 'var(--color-brand)',
};

export default function StrategicAttention() {
  const { leader } = usePimpinanLeader();
  const navigate = useNavigate();

  const items = useMemo(() => executiveAttentionByAnggota(leader.id), [leader]);

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-[15px] font-semibold text-ink">Executive Attention — {leader.nama.split(',')[0]}</h2>
          <p className="text-[12.5px] text-ink-soft">Insight paling penting yang membutuhkan perhatian pimpinan saat ini</p>
        </div>
        <span className="flex items-center gap-1 rounded-full bg-brand-soft px-2.5 py-0.5 text-[10.5px] font-semibold text-brand">
          <Sparkles size={11} /> AI-derived insight
        </span>
      </div>

      {items.length === 0 ? (
        <EmptyState message="Tidak ada insight untuk pimpinan ini." />
      ) : (
        <div className="space-y-3">
          {items.map((item) => (
            <div
              key={item.id}
              className="rounded-lg border border-border bg-surface p-4 lg:p-5"
              style={{ borderLeft: `4px solid ${tierBorderColor[item.tier]}` }}
            >
              <p className="text-[11px] font-bold tracking-wide text-ink-faint">
                {tierMeta[item.tier].emoji} {tierMeta[item.tier].label}
              </p>
              <p className="mt-1.5 text-[14px] font-semibold text-ink">{item.issue}</p>

              <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-3">
                <div>
                  <p className="text-[10.5px] font-semibold uppercase text-ink-faint">Evidence</p>
                  <p className="text-[12px] text-ink-soft">{item.evidence}</p>
                </div>
                <div>
                  <p className="text-[10.5px] font-semibold uppercase text-ink-faint">Trend</p>
                  <p className="text-[12px] text-ink-soft">{item.trend}</p>
                </div>
                <div>
                  <p className="text-[10.5px] font-semibold uppercase text-ink-faint">Relevance</p>
                  <p className="text-[12px] text-ink-soft">{item.relevance}</p>
                </div>
              </div>

              <div className="mt-3 rounded-md bg-brand-soft p-2.5">
                <p className="text-[10.5px] font-semibold uppercase text-brand">Recommended Attention</p>
                <p className="mt-0.5 text-[12px] text-ink">{item.recommendedAttention}</p>
              </div>

              {item.isuId && (
                <button onClick={() => navigate(`/isu-wilayah/${item.isuId}`)} className="mt-2.5 text-[12px] font-medium text-brand hover:underline">
                  Lihat Detail Isu →
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
