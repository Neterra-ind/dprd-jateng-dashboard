import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, ExternalLink } from 'lucide-react';
import { beritaById } from '../data/berita';
import { mediaById } from '../data/media';
import { isuById } from '../data/isuWilayah';
import { komisiById } from '../data/komisi';
import { anggotaById } from '../data/anggota';
import { SectionCard, EmptyState, Avatar } from '../components/ui';
import { SentimentBadge, DemoDataTag, RealDataTag } from '../components/Badges';

export default function NewsDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const berita = id ? beritaById(id) : undefined;

  if (!berita) return <EmptyState message="Berita tidak ditemukan." />;

  const media = mediaById(berita.mediaId);
  const isu = isuById(berita.isuId);

  return (
    <div className="mx-auto max-w-3xl">
      <button onClick={() => navigate(-1)} className="mb-4 flex items-center gap-1.5 text-[12.5px] font-medium text-ink-soft hover:text-ink">
        <ArrowLeft size={14} /> Kembali
      </button>

      <SectionCard>
        <div className="flex items-center gap-2 flex-wrap mb-3">
          <span className="text-[11.5px] font-medium text-ink-faint">{media?.nama}</span>
          <span className="text-ink-faint">·</span>
          <span className="text-[11.5px] text-ink-faint">
            {new Date(berita.tanggal).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
          </span>
          {berita.isReal ? <RealDataTag /> : <DemoDataTag />}
        </div>

        <h1 className="text-[19px] font-semibold leading-snug text-ink">{berita.headline}</h1>

        <div className="mt-3 flex flex-wrap items-center gap-2">
          <SentimentBadge sentiment={berita.sentiment} />
          <span className="rounded-full bg-surface-alt px-2.5 py-0.5 text-[11px] font-medium text-ink-soft">Tone: {berita.tone}</span>
          {berita.komisiIds.map((k) => (
            <button
              key={k}
              onClick={() => navigate(`/isu-komisi/${k}`)}
              className="rounded-full bg-brand-soft px-2.5 py-0.5 text-[11px] font-medium text-brand hover:bg-brand hover:text-white"
            >
              {komisiById(k)?.nama}
            </button>
          ))}
        </div>

        <p className="mt-4 text-[13.5px] leading-relaxed text-ink-soft">{berita.ringkasan}</p>

        {berita.pernyataan && (
          <blockquote className="mt-4 rounded-md border-l-4 border-brand bg-brand-soft/40 p-3 text-[13px] italic text-ink">
            {berita.pernyataan}
          </blockquote>
        )}

        <dl className="mt-5 grid grid-cols-2 gap-4 border-t border-border pt-4 text-[12.5px] sm:grid-cols-3">
          <div>
            <dt className="text-ink-faint">Isu</dt>
            <dd>
              {isu ? (
                <button onClick={() => navigate(`/isu-wilayah/${isu.id}`)} className="font-medium text-brand hover:underline">
                  {isu.nama}
                </button>
              ) : (
                <span className="text-ink-faint">Tidak terpetakan ke isu spesifik</span>
              )}
            </dd>
          </div>
          <div>
            <dt className="text-ink-faint">Aktor Utama</dt>
            <dd className="font-medium text-ink">{berita.aktorUtama}</dd>
          </div>
          <div>
            <dt className="text-ink-faint">Kredibilitas Media</dt>
            <dd className="font-medium text-ink">{'★'.repeat(media?.credibility ?? 0)}{'☆'.repeat(5 - (media?.credibility ?? 0))}</dd>
          </div>
        </dl>

        {berita.anggotaIds.length > 0 && (
          <div className="mt-5 border-t border-border pt-4">
            <p className="mb-2 text-[12px] font-semibold text-ink-faint uppercase">Anggota DPRD Terkait</p>
            <div className="flex flex-wrap gap-2">
              {berita.anggotaIds.map((aid) => {
                const a = anggotaById(aid);
                if (!a) return null;
                return (
                  <button key={aid} onClick={() => navigate(`/personal/${aid}`)} className="flex items-center gap-2 rounded-full border border-border py-1 pl-1 pr-3 hover:border-brand-light">
                    <Avatar name={a.nama} src={a.foto} size={24} />
                    <span className="text-[12px] font-medium text-ink">{a.nama}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        <a
          href={berita.sourceUrl}
          target="_blank"
          rel="noreferrer"
          className="mt-5 flex items-center gap-1.5 text-[12.5px] font-medium text-brand hover:underline"
        >
          Sumber berita <ExternalLink size={13} />
        </a>
      </SectionCard>
    </div>
  );
}
