import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { isuById } from '../data/isuWilayah';
import { wilayahById } from '../data/wilayah';
import { opdById } from '../data/opd';
import { urusanById } from '../data/urusan';
import { komisiById } from '../data/komisi';
import { anggotaById } from '../data/anggota';
import { beritaList } from '../data/berita';
import { mediaById } from '../data/media';
import { risikoByIsuId } from '../data/risiko';
import { oversightGapByIsuId } from '../data/oversightGap';
import { SectionCard, EmptyState, Avatar } from '../components/ui';
import { SentimentBadge, StatusBadge, TrendTag, RiskLevelBadge, DemoDataTag, RealDataTag } from '../components/Badges';
import Timeline from '../components/Timeline';
import OPDProfileDrawer from '../components/OPDProfileDrawer';
import { useState } from 'react';

export default function IsuDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isu = id ? isuById(id) : undefined;
  const [selectedOpdId, setSelectedOpdId] = useState<string | null>(null);

  if (!isu) {
    return <EmptyState message="Isu tidak ditemukan." />;
  }

  const relatedBerita = beritaList.filter((b) => b.isuId === isu.id).slice(0, 8);
  const risk = risikoByIsuId(isu.id);
  const gap = oversightGapByIsuId(isu.id);

  return (
    <div>
      <button onClick={() => navigate(-1)} className="mb-4 flex items-center gap-1.5 text-[12.5px] font-medium text-ink-soft hover:text-ink">
        <ArrowLeft size={14} /> Kembali
      </button>

      <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="mb-1 text-[11.5px] font-medium text-ink-faint">Isu Wilayah · {isu.kategori}</p>
          <div className="flex items-center gap-2.5 flex-wrap">
            <h1 className="text-[21px] font-semibold tracking-tight text-ink">{isu.nama}</h1>
            {isu.isDataReal ? <RealDataTag /> : <DemoDataTag />}
          </div>
          <p className="mt-1.5 max-w-2xl text-[13px] text-ink-soft">{isu.ringkasan}</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <SentimentBadge sentiment={isu.sentiment} />
          {isu.strategic && <span className="rounded-full bg-brand-soft px-2.5 py-0.5 text-[11px] font-medium text-brand">Isu Strategis</span>}
          {isu.emerging && <span className="rounded-full bg-[var(--color-neutral-soft)] px-2.5 py-0.5 text-[11px] font-medium text-[var(--color-neutral)]">Isu Meningkat</span>}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4 mb-5">
        <div className="rounded-lg border border-border bg-surface p-3.5">
          <p className="text-[11px] font-medium uppercase text-ink-faint">Volume</p>
          <p className="mt-1 text-[20px] font-semibold text-ink">{isu.volume.toLocaleString('id-ID')}</p>
        </div>
        <div className="rounded-lg border border-border bg-surface p-3.5">
          <p className="text-[11px] font-medium uppercase text-ink-faint">Trend</p>
          <p className="mt-1"><TrendTag value={isu.trend} /></p>
        </div>
        <div className="rounded-lg border border-border bg-surface p-3.5">
          <p className="text-[11px] font-medium uppercase text-ink-faint">Respons Pemda</p>
          <p className="mt-1"><StatusBadge status={isu.statusResponsPemda} /></p>
        </div>
        <div className="rounded-lg border border-border bg-surface p-3.5">
          <p className="text-[11px] font-medium uppercase text-ink-faint">Respons DPRD</p>
          <p className="mt-1"><StatusBadge status={isu.statusResponsDprd} /></p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          <SectionCard title="Timeline Perkembangan Isu">
            <Timeline entries={isu.timeline} />
          </SectionCard>

          <SectionCard title="Pemberitaan Terkait" description={`${relatedBerita.length} dari total berita terkait isu ini`}>
            {relatedBerita.length === 0 ? (
              <EmptyState message="Belum ada pemberitaan terkait." />
            ) : (
              <div className="space-y-3">
                {relatedBerita.map((b) => (
                  <button
                    key={b.id}
                    onClick={() => navigate(`/media-monitoring/${b.id}`)}
                    className="block w-full rounded-md border border-border p-3 text-left hover:border-brand-light hover:bg-brand-soft/30"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-[13px] font-medium text-ink">{b.headline}</p>
                      <SentimentBadge sentiment={b.sentiment} />
                    </div>
                    <p className="mt-1 text-[11.5px] text-ink-faint">
                      {mediaById(b.mediaId)?.nama} · {new Date(b.tanggal).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </p>
                  </button>
                ))}
              </div>
            )}
          </SectionCard>
        </div>

        <div className="space-y-4">
          <SectionCard title="Klasifikasi & Keterkaitan">
            <dl className="space-y-3 text-[12.5px]">
              <div>
                <dt className="text-ink-faint">Lokasi</dt>
                <dd className="font-medium text-ink">{isu.wilayahIds.map((w) => wilayahById(w)?.nama).join(', ')}</dd>
              </div>
              <div>
                <dt className="text-ink-faint">Urusan Pemerintahan</dt>
                <dd className="font-medium text-ink">{urusanById(isu.urusanId)?.nama}</dd>
              </div>
              <div>
                <dt className="text-ink-faint">OPD Terkait</dt>
                <dd className="flex flex-wrap gap-1.5 mt-1">
                  {isu.opdIds.map((o) => (
                    <button
                      key={o}
                      onClick={() => setSelectedOpdId(o)}
                      className="rounded-full bg-surface-alt px-2 py-0.5 text-[11.5px] font-medium text-ink-soft hover:bg-ink hover:text-white"
                    >
                      {opdById(o)?.singkatan}
                    </button>
                  ))}
                </dd>
              </div>
              <div>
                <dt className="text-ink-faint">Komisi DPRD Terkait</dt>
                <dd className="flex flex-wrap gap-1.5 mt-1">
                  {isu.komisiIds.map((k) => (
                    <button
                      key={k}
                      onClick={() => navigate(`/isu-komisi/${k}`)}
                      className="rounded-full bg-brand-soft px-2 py-0.5 text-[11.5px] font-medium text-brand hover:bg-brand hover:text-white"
                    >
                      {komisiById(k)?.nama}
                    </button>
                  ))}
                </dd>
              </div>
              <div>
                <dt className="text-ink-faint">Dampak</dt>
                <dd className="font-medium text-ink">{isu.dampak.join(', ')}</dd>
              </div>
              {isu.catatanResponsPemda && (
                <div>
                  <dt className="text-ink-faint">Catatan Respons Pemda</dt>
                  <dd className="text-ink-soft">{isu.catatanResponsPemda}</dd>
                </div>
              )}
              {isu.catatanResponsDprd && (
                <div>
                  <dt className="text-ink-faint">Catatan Respons DPRD</dt>
                  <dd className="text-ink-soft">{isu.catatanResponsDprd}</dd>
                </div>
              )}
            </dl>
          </SectionCard>

          <SectionCard title="Anggota DPRD Terkait">
            {isu.anggotaIds.length === 0 ? (
              <EmptyState message="Belum ada anggota yang terhubung." />
            ) : (
              <div className="space-y-2">
                {isu.anggotaIds.map((aid) => {
                  const a = anggotaById(aid);
                  if (!a) return null;
                  return (
                    <button
                      key={aid}
                      onClick={() => navigate(`/personal/${aid}`)}
                      className="flex w-full items-center gap-2.5 rounded-md p-1.5 -mx-1.5 text-left hover:bg-surface-alt"
                    >
                      <Avatar name={a.nama} src={a.foto} size={32} />
                      <div className="min-w-0">
                        <p className="truncate text-[12.5px] font-medium text-ink">{a.nama}</p>
                        <p className="truncate text-[11px] text-ink-faint">{a.jabatan}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </SectionCard>

          {risk && (
            <SectionCard title="Analytical Risk" description="Skor prototipe berbasis eksposur, dampak, dan tren">
              <div className="flex items-center justify-between mb-2">
                <RiskLevelBadge level={risk.level} />
                <span className="text-[18px] font-semibold text-ink">{risk.analyticalRiskScore}</span>
              </div>
              <p className="text-[12px] text-ink-soft">{risk.rekomendasi}</p>
              <button
                onClick={() => navigate('/isu-negatif')}
                className="mt-3 text-[12px] font-medium text-brand hover:underline"
              >
                Lihat pada Risk Matrix →
              </button>
            </SectionCard>
          )}

          {gap && gap.status === 'oversight_gap' && (
            <SectionCard title="DPRD Oversight Gap">
              <p className="text-[12.5px] text-ink-soft">{gap.catatan}</p>
            </SectionCard>
          )}
        </div>
      </div>

      <OPDProfileDrawer opdId={selectedOpdId} onClose={() => setSelectedOpdId(null)} />
    </div>
  );
}
