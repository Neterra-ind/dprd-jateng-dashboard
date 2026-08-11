import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader, SectionCard, EmptyState, Avatar } from '../components/ui';
import GlobalFilterBar from '../components/GlobalFilterBar';
import { useFilters } from '../context/FilterContext';
import { anggotaList } from '../data/anggota';
import { fraksiById } from '../data/fraksi';
import { komisiById } from '../data/komisi';
import { isuById } from '../data/isuWilayah';
import { filterAnggota } from '../lib/filters';
import { hasFullProfile } from '../data/types';

type SortKey = 'ekspos' | 'engagement' | 'negatif';

export default function PersonalDPRD() {
  const { filters } = useFilters();
  const navigate = useNavigate();
  const [sort, setSort] = useState<SortKey>('ekspos');

  const filtered = useMemo(() => {
    const base = filterAnggota(anggotaList, filters);
    return [...base].sort((a, b) => {
      if (sort === 'ekspos') return (b.totalEkspos ?? -1) - (a.totalEkspos ?? -1);
      if (sort === 'engagement') return (b.engagementScore ?? -1) - (a.engagementScore ?? -1);
      return (b.sentimentNegative ?? -1) - (a.sentimentNegative ?? -1);
    });
  }, [filters, sort]);

  return (
    <div>
      <PageHeader
        title="Personal DPRD"
        breadcrumb="Personal Issue Intelligence"
        description="Mengetahui isu apa yang melekat pada setiap anggota DPRD, serta bagaimana positioning personalnya terbentuk di media dan publik."
      />

      <GlobalFilterBar show={['komisi', 'anggota', 'sentiment']} />

      <div className="mb-4 flex items-center gap-2 text-[12.5px]">
        <span className="text-ink-faint">Urutkan:</span>
        {([
          { key: 'ekspos', label: 'Total Ekspos' },
          { key: 'engagement', label: 'Engagement' },
          { key: 'negatif', label: 'Sentimen Negatif' },
        ] as { key: SortKey; label: string }[]).map((o) => (
          <button
            key={o.key}
            onClick={() => setSort(o.key)}
            className={`rounded-md px-2.5 py-1 font-medium ${sort === o.key ? 'bg-brand text-white' : 'border border-border text-ink-soft hover:bg-surface-alt'}`}
          >
            {o.label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <EmptyState message="Tidak ada anggota yang sesuai dengan filter." />
      ) : (
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((a) => {
            const fraksi = fraksiById(a.fraksiId);
            const komisi = komisiById(a.komisiId);
            const fullProfile = hasFullProfile(a);
            return (
              <SectionCard key={a.id} className="cursor-pointer hover:border-brand-light">
                <button onClick={() => navigate(`/personal/${a.id}`)} className="w-full text-left">
                  <div className="flex items-start gap-3">
                    <Avatar name={a.nama} src={a.foto} size={44} />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[13.5px] font-semibold text-ink">{a.nama}</p>
                      <p className="truncate text-[11.5px] text-ink-faint">{[a.jabatan, komisi?.nama].filter(Boolean).join(' · ')}</p>
                      <p className="mt-0.5 text-[11px] text-ink-faint">{fraksi?.singkatan} · {a.dapilId}</p>
                    </div>
                  </div>

                  {fullProfile ? (
                    <>
                      <p className="mt-3 line-clamp-2 text-[12px] text-ink-soft italic">&ldquo;{a.positioning}&rdquo;</p>

                      <div className="mt-3 flex items-center justify-between text-[11.5px]">
                        <span className="text-ink-faint">Total Ekspos</span>
                        <span className="font-semibold text-ink">{a.totalEkspos}</span>
                      </div>
                      <div className="mt-2 flex h-1.5 overflow-hidden rounded-full">
                        <div style={{ width: `${a.sentimentPositive}%`, background: 'var(--color-positive)' }} />
                        <div style={{ width: `${a.sentimentNeutral}%`, background: 'var(--color-neutral)' }} />
                        <div style={{ width: `${a.sentimentNegative}%`, background: 'var(--color-negative)' }} />
                      </div>

                      <div className="mt-3 flex flex-wrap gap-1">
                        {(a.topIssueIds ?? []).slice(0, 3).map((iid) => {
                          const isu = isuById(iid);
                          return isu ? (
                            <span key={iid} className="rounded-full bg-surface-alt px-2 py-0.5 text-[10.5px] font-medium text-ink-soft">
                              {isu.nama}
                            </span>
                          ) : null;
                        })}
                      </div>
                    </>
                  ) : (
                    <p className="mt-3 text-[11.5px] text-ink-faint">Profil intelligence belum tersedia untuk anggota ini.</p>
                  )}
                </button>
              </SectionCard>
            );
          })}
        </div>
      )}
    </div>
  );
}
