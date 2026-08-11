import { ExternalLink } from 'lucide-react';
import type { IssueTimelineEntry } from '../data';

const tipeStyle: Record<IssueTimelineEntry['tipe'], { color: string; label: string }> = {
  kejadian: { color: 'var(--color-ink-faint)', label: 'Kejadian' },
  pemberitaan: { color: 'var(--color-brand)', label: 'Pemberitaan' },
  respons_pemda: { color: 'var(--color-positive)', label: 'Respons Pemda' },
  respons_dprd: { color: 'var(--color-brand-dark)', label: 'Respons DPRD' },
  eskalasi: { color: 'var(--color-negative)', label: 'Eskalasi' },
};

export default function Timeline({ entries }: { entries: IssueTimelineEntry[] }) {
  const sorted = [...entries].sort((a, b) => (a.tanggal < b.tanggal ? -1 : 1));
  return (
    <div className="relative pl-5">
      <div className="absolute left-[7px] top-1 bottom-1 w-px bg-border" />
      <div className="space-y-5">
        {sorted.map((e, idx) => {
          const style = tipeStyle[e.tipe];
          return (
            <div key={idx} className="relative">
              <span
                className="absolute -left-5 top-0.5 h-3 w-3 rounded-full border-2 border-surface"
                style={{ background: style.color }}
              />
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[11.5px] font-medium text-ink-faint">
                  {new Date(e.tanggal).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                </span>
                <span className="rounded-full px-2 py-0.5 text-[10.5px] font-medium" style={{ background: `${style.color}1a`, color: style.color }}>
                  {style.label}
                </span>
              </div>
              <p className="mt-1 text-[13px] font-semibold text-ink">{e.judul}</p>
              <p className="mt-0.5 text-[12.5px] text-ink-soft">{e.deskripsi}</p>
              {e.sourceUrl && (
                <a
                  href={e.sourceUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-1 inline-flex items-center gap-1 text-[11.5px] font-medium text-brand hover:underline"
                >
                  Baca berita asli <ExternalLink size={11} />
                </a>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
