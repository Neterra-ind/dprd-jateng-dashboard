import type { ReactNode } from 'react';
import { X } from 'lucide-react';
import { useEffect } from 'react';

export default function Drawer({
  open,
  onClose,
  title,
  eyebrow,
  action,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  eyebrow?: string;
  action?: ReactNode;
  children: ReactNode;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-navy-950/40" style={{ background: 'rgba(11,18,32,0.45)' }} onClick={onClose} />
      <div className="relative flex h-full w-full max-w-xl flex-col bg-surface shadow-2xl animate-[slideIn_0.18s_ease-out]">
        <div className="flex items-start justify-between gap-3 border-b border-border px-5 py-4">
          <div className="min-w-0">
            {eyebrow && <p className="text-[11px] font-medium uppercase tracking-wide text-ink-faint">{eyebrow}</p>}
            <h2 className="mt-0.5 text-[16px] font-semibold text-ink truncate">{title}</h2>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {action}
            <button onClick={onClose} className="rounded-md p-1.5 text-ink-faint hover:bg-surface-alt hover:text-ink">
              <X size={18} />
            </button>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto px-5 py-4 scrollbar-thin">{children}</div>
      </div>
    </div>
  );
}
