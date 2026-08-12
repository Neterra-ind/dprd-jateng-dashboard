import { useNavigate } from 'react-router-dom';
import Drawer from './Drawer';
import { EmptyState } from './ui';
import { StatusBadge, TrendTag } from './Badges';
import { opdById } from '../data/opd';
import { urusanById } from '../data/urusan';
import { isuWilayahList } from '../data/isuWilayah';
import { beritaList } from '../data/berita';

export default function OPDProfileDrawer({ opdId, onClose }: { opdId: string | null; onClose: () => void }) {
  const navigate = useNavigate();
  const opd = opdId ? opdById(opdId) : undefined;
  const relatedIsu = opd ? isuWilayahList.filter((i) => i.opdIds.includes(opd.id)) : [];
  const relatedBerita = opd ? beritaList.filter((b) => relatedIsu.some((i) => i.id === b.isuId)) : [];
  const belumRespons = relatedIsu.filter((i) => i.statusResponsPemda === 'belum').length;

  return (
    <Drawer open={!!opd} onClose={onClose} title={opd?.nama ?? ''} eyebrow="OPD Issue Profile">
      {opd && (
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-md border border-border p-3 text-center">
              <p className="text-[18px] font-semibold text-ink">{relatedIsu.length}</p>
              <p className="text-[10.5px] text-ink-faint uppercase">Isu Terkait</p>
            </div>
            <div className="rounded-md border border-border p-3 text-center">
              <p className="text-[18px] font-semibold text-ink">{relatedBerita.length}</p>
              <p className="text-[10.5px] text-ink-faint uppercase">Ekspos Media</p>
            </div>
            <div className="rounded-md border border-border p-3 text-center">
              <p className="text-[18px] font-semibold" style={{ color: belumRespons > 0 ? 'var(--color-negative)' : 'var(--color-positive)' }}>{belumRespons}</p>
              <p className="text-[10.5px] text-ink-faint uppercase">Belum Merespons</p>
            </div>
          </div>

          <div>
            <p className="text-[12px] font-semibold uppercase text-ink-faint mb-1">Urusan Pemerintahan</p>
            <p className="text-[13px] text-ink-soft">{urusanById(opd.urusanId)?.nama}</p>
          </div>

          <div>
            <p className="text-[12px] font-semibold uppercase text-ink-faint mb-2">Isu yang Menjadi Kewenangan OPD Ini</p>
            {relatedIsu.length === 0 ? (
              <EmptyState message="Belum ada isu terkait." />
            ) : (
              <div className="space-y-2">
                {relatedIsu.map((i) => (
                  <button
                    key={i.id}
                    onClick={() => navigate(`/isu-wilayah/${i.id}`)}
                    className="flex w-full items-center justify-between gap-2 rounded-md border border-border p-2.5 text-left hover:border-brand-light"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-[12.5px] font-medium text-ink">{i.nama}</p>
                      <div className="mt-1 flex items-center gap-1.5">
                        <StatusBadge status={i.statusResponsPemda} />
                      </div>
                    </div>
                    <TrendTag value={i.trend} />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </Drawer>
  );
}
