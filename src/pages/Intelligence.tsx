import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TrendingUp, Sparkles, AlertTriangle, ShieldAlert, UserRound } from 'lucide-react';
import { PageHeader, SectionCard, EmptyState } from '../components/ui';
import { intelligenceInsights } from '../data/intelligence';
import { oversightGapList } from '../data/oversightGap';
import { isuById } from '../data/isuWilayah';
import { beritaList } from '../data/berita';
import { StatusBadge } from '../components/Badges';
import type { IntelligenceCategory } from '../data';

const categoryConfig: { key: IntelligenceCategory; label: string; icon: React.ComponentType<{ size?: number }>; description: string }[] = [
  { key: 'strategic_issue', label: 'Strategic Issues', icon: TrendingUp, description: 'Isu berbobot tinggi yang memengaruhi persepsi kinerja DPRD dan Pemda' },
  { key: 'emerging_issue', label: 'Emerging Issues', icon: Sparkles, description: 'Isu yang sedang naik daun dan berpotensi membesar' },
  { key: 'oversight_gap', label: 'Oversight Gap', icon: AlertTriangle, description: 'Isu dengan eksposur tinggi namun belum direspons DPRD' },
  { key: 'reputation_risk', label: 'Reputation Risk', icon: ShieldAlert, description: 'Risiko reputasi personal maupun institusional' },
  { key: 'personal_positioning', label: 'Personal Positioning', icon: UserRound, description: 'Positioning anggota berdasarkan isu dan narasi — AI-derived' },
];

export default function Intelligence() {
  const navigate = useNavigate();
  const [mainTab, setMainTab] = useState<'insight' | 'oversight'>('insight');
  const [category, setCategory] = useState<IntelligenceCategory>('strategic_issue');

  const items = useMemo(() => intelligenceInsights.filter((i) => i.category === category), [category]);

  const dprdBerita = beritaList.filter((b) => b.anggotaIds.length > 0);
  const pemdaBerita = beritaList.filter((b) => b.anggotaIds.length === 0);
  const total = dprdBerita.length + pemdaBerita.length || 1;
  const sovDprd = Math.round((dprdBerita.length / total) * 100);
  const sovPemda = 100 - sovDprd;

  const dikritik = dprdBerita.filter((b) => b.sentiment === 'negative').length;
  const didukung = dprdBerita.filter((b) => b.sentiment === 'positive').length;

  const gapEntries = oversightGapList.filter((g) => g.status === 'oversight_gap');

  return (
    <div>
      <PageHeader
        title="Intelligence"
        breadcrumb="Strategic Intelligence"
        description="Insight strategis yang menjawab: isu apa yang membutuhkan perhatian, kesenjangan pengawasan DPRD terhadap Pemda, serta risiko reputasi personal dan institusional."
      />

      <div className="mb-5 flex flex-wrap gap-1.5 rounded-lg border border-border bg-surface-alt/60 p-1.5">
        <button
          onClick={() => setMainTab('insight')}
          className={`rounded-md px-3.5 py-1.5 text-[12.5px] font-medium ${mainTab === 'insight' ? 'bg-brand text-white' : 'text-ink-soft hover:bg-surface'}`}
        >
          5 Kategori Intelligence
        </button>
        <button
          onClick={() => setMainTab('oversight')}
          className={`rounded-md px-3.5 py-1.5 text-[12.5px] font-medium ${mainTab === 'oversight' ? 'bg-brand text-white' : 'text-ink-soft hover:bg-surface'}`}
        >
          DPRD vs Pemda
        </button>
      </div>

      {mainTab === 'insight' ? (
        <div>
          <div className="mb-5 grid grid-cols-2 gap-2 md:grid-cols-5">
            {categoryConfig.map((c) => (
              <button
                key={c.key}
                onClick={() => setCategory(c.key)}
                className={`rounded-lg border p-3 text-left transition-colors ${
                  category === c.key ? 'border-brand bg-brand-soft' : 'border-border bg-surface hover:border-brand-light'
                }`}
              >
                <c.icon size={16} />
                <p className="mt-1.5 text-[12.5px] font-semibold text-ink">{c.label}</p>
                <p className="mt-0.5 text-[11px] text-ink-faint line-clamp-2">{c.description}</p>
              </button>
            ))}
          </div>

          {items.length === 0 ? (
            <EmptyState message="Belum ada insight pada kategori ini." />
          ) : (
            <div className="space-y-4">
              {items.map((insight) => (
                <SectionCard key={insight.id}>
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <h3 className="text-[14.5px] font-semibold text-ink max-w-2xl">{insight.judul}</h3>
                    {insight.category === 'personal_positioning' && (
                      <span className="flex items-center gap-1 rounded-full bg-brand-soft px-2.5 py-0.5 text-[10.5px] font-semibold text-brand shrink-0">
                        <Sparkles size={11} /> AI-derived positioning
                      </span>
                    )}
                  </div>

                  <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-2">
                    <div>
                      <p className="text-[11px] font-semibold uppercase text-ink-faint">Evidence</p>
                      <p className="text-[12.5px] text-ink-soft">{insight.evidence}</p>
                    </div>
                    <div>
                      <p className="text-[11px] font-semibold uppercase text-ink-faint">Trend</p>
                      <p className="text-[12.5px] text-ink-soft">{insight.trend}</p>
                    </div>
                    <div>
                      <p className="text-[11px] font-semibold uppercase text-ink-faint">Impact</p>
                      <p className="text-[12.5px] text-ink-soft">{insight.impact}</p>
                    </div>
                    <div>
                      <p className="text-[11px] font-semibold uppercase text-ink-faint">Relevance</p>
                      <p className="text-[12.5px] text-ink-soft">{insight.relevance}</p>
                    </div>
                  </div>

                  <div className="mt-3">
                    <p className="text-[11px] font-semibold uppercase text-ink-faint">Actors</p>
                    <div className="mt-1 flex flex-wrap gap-1.5">
                      {insight.actors.map((a) => (
                        <span key={a} className="rounded-full bg-surface-alt px-2.5 py-0.5 text-[11px] font-medium text-ink-soft">{a}</span>
                      ))}
                    </div>
                  </div>

                  <div className="mt-3 rounded-md bg-[var(--color-brand-soft)] p-3">
                    <p className="text-[11px] font-semibold uppercase text-brand">Recommended Attention</p>
                    <p className="mt-0.5 text-[12.5px] text-ink">{insight.recommendedAttention}</p>
                  </div>

                  <div className="mt-3 flex gap-3">
                    {insight.isuId && (
                      <button onClick={() => navigate(`/isu-wilayah/${insight.isuId}`)} className="text-[12px] font-medium text-brand hover:underline">
                        Lihat Detail Isu →
                      </button>
                    )}
                    {insight.anggotaId && (
                      <button onClick={() => navigate(`/personal/${insight.anggotaId}`)} className="text-[12px] font-medium text-brand hover:underline">
                        Lihat Profil Anggota →
                      </button>
                    )}
                  </div>
                </SectionCard>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            <SectionCard title="Share of Voice: DPRD vs Pemda" className="lg:col-span-1">
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-[12.5px] mb-1">
                    <span className="font-medium text-ink">DPRD</span>
                    <span className="font-semibold text-brand">{sovDprd}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-surface-alt overflow-hidden"><div className="h-full bg-brand" style={{ width: `${sovDprd}%` }} /></div>
                </div>
                <div>
                  <div className="flex justify-between text-[12.5px] mb-1">
                    <span className="font-medium text-ink">Pemda (OPD)</span>
                    <span className="font-semibold text-ink-soft">{sovPemda}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-surface-alt overflow-hidden"><div className="h-full bg-ink-faint" style={{ width: `${sovPemda}%`, background: 'var(--color-ink-faint)' }} /></div>
                </div>
              </div>
              <p className="mt-3 text-[11.5px] text-ink-faint">Berdasarkan proporsi berita yang menyebut aktor DPRD vs OPD/Pemda sebagai aktor utama.</p>
            </SectionCard>

            <SectionCard title="Sikap DPRD terhadap Isu Wilayah">
              <div className="grid grid-cols-2 gap-3 text-center">
                <div className="rounded-md border border-border p-3">
                  <p className="text-[20px] font-semibold" style={{ color: 'var(--color-negative)' }}>{dikritik}</p>
                  <p className="text-[11px] text-ink-faint">Berita bernada kritik dari DPRD</p>
                </div>
                <div className="rounded-md border border-border p-3">
                  <p className="text-[20px] font-semibold" style={{ color: 'var(--color-positive)' }}>{didukung}</p>
                  <p className="text-[11px] text-ink-faint">Berita bernada dukungan dari DPRD</p>
                </div>
              </div>
            </SectionCard>

            <SectionCard title="Ringkasan Oversight Gap">
              <p className="text-[32px] font-semibold text-ink">{gapEntries.length}</p>
              <p className="text-[12px] text-ink-soft">isu dengan eksposur signifikan namun belum direspons resmi oleh DPRD</p>
            </SectionCard>
          </div>

          <SectionCard title="DPRD Oversight Gap" description="Isu yang telah/belum direspons Pemda dibanding respons DPRD">
            <div className="overflow-x-auto -mx-4 lg:-mx-5">
              <table className="w-full min-w-[800px] text-[12.5px]">
                <thead>
                  <tr className="border-b border-border text-left text-[11px] uppercase tracking-wide text-ink-faint">
                    <th className="px-4 py-2 font-medium lg:px-5">Isu</th>
                    <th className="px-3 py-2 font-medium">Eksposur</th>
                    <th className="px-3 py-2 font-medium">Respons Pemda</th>
                    <th className="px-3 py-2 font-medium">Respons DPRD</th>
                    <th className="px-3 py-2 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {oversightGapList.map((g) => {
                    const isu = isuById(g.isuId);
                    return (
                      <tr key={g.id} onClick={() => navigate(`/isu-wilayah/${g.isuId}`)} className="cursor-pointer border-b border-border last:border-0 hover:bg-surface-alt">
                        <td className="px-4 py-2.5 font-medium text-ink lg:px-5">{isu?.nama}</td>
                        <td className="px-3 py-2.5 text-ink-soft capitalize">{g.ekspos}</td>
                        <td className="px-3 py-2.5"><StatusBadge status={g.responsPemda} /></td>
                        <td className="px-3 py-2.5"><StatusBadge status={g.responsDprd} /></td>
                        <td className="px-3 py-2.5">
                          {g.status === 'oversight_gap' ? (
                            <span className="rounded-full bg-[var(--color-negative-soft)] px-2.5 py-0.5 text-[11px] font-semibold text-[var(--color-negative)]">Oversight Gap</span>
                          ) : g.status === 'aligned' ? (
                            <span className="rounded-full bg-[var(--color-positive-soft)] px-2.5 py-0.5 text-[11px] font-semibold text-[var(--color-positive)]">Selaras</span>
                          ) : (
                            <span className="rounded-full bg-surface-alt px-2.5 py-0.5 text-[11px] font-semibold text-ink-soft">Dipantau</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </SectionCard>
        </div>
      )}
    </div>
  );
}
