import type { ReactNode } from 'react';
import { DemoDataTag } from './Badges';

export function KPICard({
  label,
  value,
  sub,
  accent = 'neutral',
}: {
  label: string;
  value: string;
  sub?: ReactNode;
  accent?: 'neutral' | 'positive' | 'negative' | 'brand';
}) {
  const accentColor = {
    neutral: 'var(--color-ink)',
    positive: 'var(--color-positive)',
    negative: 'var(--color-negative)',
    brand: 'var(--color-brand)',
  }[accent];

  return (
    <div className="rounded-lg border border-border bg-surface p-4">
      <p className="text-[11.5px] font-medium text-ink-faint uppercase tracking-wide">{label}</p>
      <p className="mt-1.5 text-[26px] font-semibold leading-none tracking-tight" style={{ color: accentColor }}>
        {value}
      </p>
      {sub && <div className="mt-1.5 text-[12px] text-ink-soft">{sub}</div>}
    </div>
  );
}

export function SectionCard({
  title,
  description,
  action,
  children,
  className = '',
}: {
  title?: string;
  description?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`rounded-lg border border-border bg-surface p-4 lg:p-5 ${className}`}>
      {title && (
        <div className="mb-3.5 flex items-start justify-between gap-3">
          <div>
            <h3 className="text-[14px] font-semibold text-ink">{title}</h3>
            {description && <p className="mt-0.5 text-[12px] text-ink-soft">{description}</p>}
          </div>
          {action}
        </div>
      )}
      {children}
    </div>
  );
}

export function PageHeader({
  title,
  description,
  breadcrumb,
  action,
}: {
  title: string;
  description?: string;
  breadcrumb?: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
      <div>
        {breadcrumb && <p className="mb-1 text-[11.5px] font-medium text-ink-faint">{breadcrumb}</p>}
        <div className="flex items-center gap-2.5">
          <h1 className="text-[20px] font-semibold tracking-tight text-ink">{title}</h1>
          <DemoDataTag />
        </div>
        {description && <p className="mt-1 max-w-2xl text-[13px] text-ink-soft">{description}</p>}
      </div>
      {action}
    </div>
  );
}

export function EmptyState({ message }: { message: string }) {
  return (
    <div className="flex items-center justify-center rounded-md border border-dashed border-border py-10 text-[13px] text-ink-faint">
      {message}
    </div>
  );
}

export function ClickableRow({ onClick, children, className = '' }: { onClick: () => void; children: ReactNode; className?: string }) {
  return (
    <div
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => (e.key === 'Enter' ? onClick() : undefined)}
      className={`cursor-pointer transition-colors hover:bg-surface-alt ${className}`}
    >
      {children}
    </div>
  );
}

export function ProgressBar({ value, colorVar = 'var(--color-brand)' }: { value: number; colorVar?: string }) {
  return (
    <div className="h-1.5 w-full rounded-full bg-surface-alt overflow-hidden">
      <div className="h-full rounded-full" style={{ width: `${Math.min(100, Math.max(0, value))}%`, background: colorVar }} />
    </div>
  );
}

export function Avatar({ name, size = 36, src }: { name: string; size?: number; src?: string }) {
  if (src) {
    return (
      <img
        src={src}
        alt={name}
        className="shrink-0 rounded-full object-cover object-top"
        style={{ width: size, height: size }}
      />
    );
  }

  const initials = name
    .replace(/,.*$/, '')
    .split(' ')
    .filter((w) => w.length > 1)
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase();
  return (
    <div
      className="flex shrink-0 items-center justify-center rounded-full bg-brand-soft font-semibold text-brand"
      style={{ width: size, height: size, fontSize: size * 0.36 }}
    >
      {initials}
    </div>
  );
}
