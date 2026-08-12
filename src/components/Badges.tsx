import type { ReactNode } from 'react';
import type { ResponseStatus, RiskLevel, Sentiment, Urgency } from '../data';

function Tag({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium whitespace-nowrap ${className}`}>
      {children}
    </span>
  );
}

const sentimentStyle: Record<Sentiment, string> = {
  positive: 'bg-[var(--color-positive-soft)] text-[var(--color-positive)]',
  neutral: 'bg-[var(--color-neutral-soft)] text-[var(--color-neutral)]',
  negative: 'bg-[var(--color-negative-soft)] text-[var(--color-negative)]',
};

const sentimentLabel: Record<Sentiment, string> = {
  positive: 'Positif',
  neutral: 'Netral',
  negative: 'Negatif',
};

export function SentimentBadge({ sentiment }: { sentiment: Sentiment }) {
  return <Tag className={sentimentStyle[sentiment]}>{sentimentLabel[sentiment]}</Tag>;
}

const urgencyStyle: Record<Urgency, string> = {
  low: 'bg-[var(--color-risk-low)]/12 text-[var(--color-risk-low)]',
  medium: 'bg-[var(--color-risk-medium)]/15 text-[var(--color-risk-medium)]',
  high: 'bg-[var(--color-risk-high)]/15 text-[var(--color-risk-high)]',
  critical: 'bg-[var(--color-risk-critical)]/15 text-[var(--color-risk-critical)]',
};

const urgencyLabel: Record<Urgency, string> = {
  low: 'Rendah',
  medium: 'Sedang',
  high: 'Tinggi',
  critical: 'Kritis',
};

export function RiskLevelBadge({ level }: { level: RiskLevel }) {
  return <Tag className={urgencyStyle[level]}>{urgencyLabel[level].toUpperCase()}</Tag>;
}

const statusStyle: Record<ResponseStatus, string> = {
  ada: 'bg-[var(--color-positive-soft)] text-[var(--color-positive)]',
  sebagian: 'bg-[var(--color-neutral-soft)] text-[var(--color-neutral)]',
  belum: 'bg-[var(--color-negative-soft)] text-[var(--color-negative)]',
};

const statusLabel: Record<ResponseStatus, string> = {
  ada: 'Ada Respons',
  sebagian: 'Sebagian',
  belum: 'Belum Ada',
};

export function StatusBadge({ status }: { status: ResponseStatus }) {
  return <Tag className={statusStyle[status]}>{statusLabel[status]}</Tag>;
}

export function NeutralTag({ children }: { children: ReactNode }) {
  return <Tag className="bg-surface-alt text-ink-soft border border-border">{children}</Tag>;
}

export function DemoDataTag() {
  return (
    <span className="inline-flex items-center rounded-full border border-border-strong bg-surface-alt px-2.5 py-0.5 text-[10.5px] font-semibold tracking-wide text-ink-faint">
      DEMO DATA
    </span>
  );
}

/**
 * Marks content sourced from the real scraped news dataset (2026-08-04 to 2026-08-11),
 * as opposed to illustrative demo content. Isu/anggota linkage is keyword-based classification,
 * so it's labeled as such rather than presented as manually verified editorial tagging.
 */
export function RealDataTag() {
  return (
    <span className="inline-flex items-center rounded-full border border-[var(--color-accent)]/40 bg-[var(--color-accent)]/10 px-2.5 py-0.5 text-[10.5px] font-semibold tracking-wide text-[var(--color-accent)]">
      DATA REAL &middot; KLASIFIKASI AI
    </span>
  );
}

export function TrendTag({ value, invert = false }: { value: number; invert?: boolean }) {
  const rising = value >= 0;
  const isGood = invert ? !rising : rising;
  return (
    <span
      className={`inline-flex items-center gap-0.5 text-[12px] font-semibold ${
        isGood ? 'text-[var(--color-positive)]' : 'text-[var(--color-negative)]'
      }`}
    >
      {rising ? '▲' : '▼'} {Math.abs(value)}%
    </span>
  );
}
