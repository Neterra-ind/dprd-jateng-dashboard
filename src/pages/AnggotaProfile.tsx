import { useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Sparkles } from 'lucide-react';
import { anggotaById } from '../data/anggota';
import { fraksiById } from '../data/fraksi';
import { komisiById } from '../data/komisi';
import { opdById } from '../data/opd';
import { beritaList } from '../data/berita';
import { mediaById } from '../data/media';
import { sosmedAnggota } from '../data/medsos';
import { isuById } from '../data/isuWilayah';
import { SectionCard, EmptyState, Avatar, ProgressBar } from '../components/ui';
import { SentimentBadge, DemoDataTag } from '../components/Badges';
import SentimentDonut from '../components/charts/SentimentDonut';
import { issueWeightBreakdown } from '../lib/aggregations';
import { hasFullProfile } from '../data/types';

const toneLabel = (positive: number) => (positive >= 75 ? 'Konstruktif' : positive >= 55 ? 'Kritis-Konstruktif' : 'Kritis');
const konsistensiLabel = (n: number) => (n <= 2 ? 'Tinggi' : n <= 3 ? 'Sedang' : 'Beragam');

export default function AnggotaProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const anggota = id ? anggotaById(id) : undefined;

  const berita = useMemo(() => (anggota ? beritaList.filter((b) => b.anggotaIds.includes(anggota.id)) : []), [anggota]);
  const posts = useMemo(
    () => (anggota ? sosmedAnggota.filter((p) => p.anggotaId === anggota.id).sort((a, b) => b.likes + b.comments + b.shares - (a.likes + a.comments + a.shares)) : []),
    [anggota]
  );
  const breakdown = useMemo(() => (anggota ? issueWeightBreakdown(anggota) : []), [anggota]);
  const topStatement = useMemo(() => berita.find((b) => b.pernyataan), [berita]);
  const negatif = useMemo(() => berita.filter((b) => b.sentiment === 'negative').slice(0, 4), [berita]);

  if (!anggota) return <EmptyState message="Anggota tidak ditemukan." />;

  const fraksi = fraksiById(anggota.fraksiId);
  const komisi = komisiById(anggota.komisiId);

  if (!hasFullProfile(anggota)) {
    return (
      <div>
        <button onClick={() => navigate(-1)} className="mb-4 flex items-center gap-1.5 text-[12.5px] font-medium text-ink-soft hover:text-ink">
          <ArrowLeft size={14} /> Kembali
        </button>

        <div className="mb-5 flex items-start gap-4">
          <Avatar name={anggota.nama} src={anggota.foto} size={64} />
          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <h1 className="text-[21px] font-semibold tracking-tight text-ink">{anggota.nama}</h1>
              <DemoDataTag />
            </div>
            <p className="mt-0.5 text-[13px] text-ink-soft">
              {[anggota.jabatan, komisi?.nama, anggota.periode].filter(Boolean).join(' · ')}
            </p>
            <p className="mt-1 text-[12.5px] text-ink-faint">{fraksi?.nama} · {anggota.dapilId}</p>
          </div>
        </div>

        <SectionCard>
          <EmptyState message="Profil intelligence (isu personal, sentimen, engagement, dan aset digital) belum tersedia untuk anggota ini." />
        </SectionCard>
      </div>
    );
  }

  const dominantIssue = breakdown[0] ? isuById(breakdown[0].isuId) : undefined;
  const relatedOpd = dominantIssue ? opdById(dominantIssue.opdIds[0]) : undefined;

  return (
    <div>
      <button onClick={() => navigate(-1)} className="mb-4 flex items-center gap-1.5 text-[12.5px] font-medium text-ink-soft hover:text-ink">
        <ArrowLeft size={14} /> Kembali
      </button>

      <div className="mb-5 flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-start gap-4">
          <Avatar name={anggota.nama} src={anggota.foto} size={64} />
          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <h1 className="text-[21px] font-semibold tracking-tight text-ink">{anggota.nama}</h1>
              <DemoDataTag />
            </div>
            <p className="mt-0.5 text-[13px] text-ink-soft">
              {[anggota.jabatan, komisi?.nama, anggota.periode].filter(Boolean).join(' · ')}
            </p>
            <p className="mt-1 text-[12.5px] text-ink-faint">{fraksi?.nama} · {anggota.dapilId}</p>
          </div>
        </div>
        <div className="flex gap-3">
          <div className="rounded-lg border border-border bg-surface px-4 py-2.5 text-center">
            <p className="text-[18px] font-semibold text-ink">{anggota.totalEkspos}</p>
            <p className="text-[10.5px] uppercase text-ink-faint">Total Ekspos</p>
          </div>
          <div className="rounded-lg border border-border bg-surface px-4 py-2.5 text-center">
            <p className="text-[18px] font-semibold text-ink">{anggota.engagementScore}</p>
            <p className="text-[10.5px] uppercase text-ink-faint">Engagement Score</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          <SectionCard title="Personal Issue" description="Isu yang paling sering dikaitkan dengan anggota ini">
            <div className="space-y-3">
              {breakdown.map((b, idx) => (
                <button
                  key={b.isuId}
                  onClick={() => navigate(`/isu-wilayah/${b.isuId}`)}
                  className="block w-full text-left"
                >
                  <div className="flex items-center justify-between text-[12.5px] mb-1">
                    <span className="font-medium text-ink">{idx + 1}. {b.isu?.nama}</span>
                    <span className="font-semibold text-ink-soft">{b.pct}%</span>
                  </div>
                  <ProgressBar value={b.pct} colorVar={idx === 0 ? 'var(--color-brand)' : 'var(--color-border-strong)'} />
                </button>
              ))}
            </div>
          </SectionCard>

          <SectionCard
            title="Personal Positioning"
            description="Bagaimana anggota diposisikan berdasarkan isu dan narasinya"
            action={
              <span className="flex items-center gap-1 rounded-full bg-brand-soft px-2.5 py-0.5 text-[10.5px] font-semibold text-brand">
                <Sparkles size={11} /> AI-derived positioning
              </span>
            }
          >
            <p className="text-[14px] font-medium italic text-ink">&ldquo;{anggota.positioning}&rdquo;</p>
            <div className="mt-4 grid grid-cols-2 gap-3 text-[12.5px] sm:grid-cols-3">
              <div>
                <p className="text-ink-faint">Tone Dominan</p>
                <p className="font-medium text-ink">{toneLabel(anggota.sentimentPositive ?? 0)}</p>
              </div>
              <div>
                <p className="text-ink-faint">Konsistensi Isu</p>
                <p className="font-medium text-ink">{konsistensiLabel(anggota.topIssueIds?.length ?? 0)}</p>
              </div>
              <div>
                <p className="text-ink-faint">Engagement</p>
                <p className="font-medium text-ink">{anggota.engagementScore}/100</p>
              </div>
              <div>
                <p className="text-ink-faint">Pihak Sering Dikritik</p>
                <p className="font-medium text-ink">{relatedOpd?.singkatan ?? '—'}</p>
              </div>
              <div>
                <p className="text-ink-faint">Pihak Sering Didukung</p>
                <p className="font-medium text-ink">{komisi?.nama ?? '—'}</p>
              </div>
              <div>
                <p className="text-ink-faint">Isu Dominan</p>
                <p className="font-medium text-ink">{dominantIssue?.nama ?? '—'}</p>
              </div>
            </div>
          </SectionCard>

          <SectionCard title="Top Statement" description="Pernyataan paling relevan dari pemberitaan">
            {topStatement ? (
              <div>
                <p className="text-[13px] italic text-ink">{topStatement.pernyataan}</p>
                <p className="mt-2 text-[11.5px] text-ink-faint">
                  {mediaById(topStatement.mediaId)?.nama} · {topStatement.headline}
                </p>
              </div>
            ) : (
              <EmptyState message="Belum ada pernyataan tercatat." />
            )}
          </SectionCard>

          <SectionCard title="Pemberitaan Terkait">
            {berita.length === 0 ? (
              <EmptyState message="Belum ada pemberitaan terkait anggota ini." />
            ) : (
              <div className="space-y-2.5">
                {berita.slice(0, 6).map((b) => (
                  <button
                    key={b.id}
                    onClick={() => navigate(`/media-monitoring/${b.id}`)}
                    className="flex w-full items-start justify-between gap-2 rounded-md border border-border p-2.5 text-left hover:border-brand-light"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-[12.5px] font-medium text-ink">{b.headline}</p>
                      <p className="text-[11px] text-ink-faint">{mediaById(b.mediaId)?.nama}</p>
                    </div>
                    <SentimentBadge sentiment={b.sentiment} />
                  </button>
                ))}
              </div>
            )}
          </SectionCard>
        </div>

        <div className="space-y-4">
          <SectionCard title="Distribusi Sentimen">
            <div className="flex justify-center">
              <SentimentDonut positive={anggota.sentimentPositive ?? 0} neutral={anggota.sentimentNeutral ?? 0} negative={anggota.sentimentNegative ?? 0} size={140} />
            </div>
          </SectionCard>

          <SectionCard title="Top Content" description="Postingan media sosial dengan engagement tertinggi">
            {posts.length === 0 ? (
              <EmptyState message="Belum ada konten media sosial." />
            ) : (
              <div className="space-y-3">
                {posts.slice(0, 3).map((p) => (
                  <div key={p.id} className="rounded-md border border-border p-2.5">
                    <p className="text-[11px] uppercase tracking-wide text-ink-faint">{p.platform}</p>
                    <p className="mt-1 text-[12.5px] text-ink">{p.konten}</p>
                    <p className="mt-1.5 text-[11px] text-ink-faint">
                      {p.likes.toLocaleString('id-ID')} suka · {p.comments.toLocaleString('id-ID')} komentar · {p.shares.toLocaleString('id-ID')} share
                    </p>
                  </div>
                ))}
              </div>
            )}
          </SectionCard>

          {negatif.length > 0 && (
            <SectionCard title="Isu Negatif Terkait">
              <div className="space-y-2">
                {negatif.map((b) => (
                  <button
                    key={b.id}
                    onClick={() => navigate(`/media-monitoring/${b.id}`)}
                    className="block w-full rounded-md px-2 py-1.5 -mx-2 text-left hover:bg-surface-alt"
                  >
                    <p className="text-[12px] font-medium text-ink truncate">{b.headline}</p>
                  </button>
                ))}
              </div>
            </SectionCard>
          )}
        </div>
      </div>
    </div>
  );
}
