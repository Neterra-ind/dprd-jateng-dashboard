import { Search, ChevronDown } from 'lucide-react';
import { useState } from 'react';
import { roleLabels, useFilters, type Role } from '../context/FilterContext';

export default function Topbar() {
  const { role, setRole, filters, setFilter } = useFilters();
  const [roleOpen, setRoleOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-4 border-b border-border bg-surface/95 px-4 lg:px-6 backdrop-blur">
      <div className="flex items-center gap-3 min-w-0">
        <div className="relative flex items-center max-w-sm w-full lg:w-80">
          <Search size={15} className="absolute left-2.5 text-ink-faint" />
          <input
            value={filters.search}
            onChange={(e) => setFilter('search', e.target.value)}
            placeholder="Cari isu, anggota, media, berita..."
            className="w-full rounded-md border border-border bg-surface-alt py-1.5 pl-8 pr-3 text-[13px] outline-none focus:border-brand-light focus:ring-1 focus:ring-brand-light"
          />
        </div>
      </div>

      <div className="flex items-center gap-3 shrink-0">
        <span className="hidden md:inline-flex items-center rounded-full border border-border-strong bg-surface-alt px-2.5 py-1 text-[11px] font-medium text-ink-soft">
          DEMO DATA
        </span>
        <div className="relative">
          <button
            onClick={() => setRoleOpen((v) => !v)}
            onBlur={() => setTimeout(() => setRoleOpen(false), 150)}
            className="flex items-center gap-2 rounded-md border border-border bg-surface px-3 py-1.5 text-[13px] font-medium text-ink hover:bg-surface-alt"
          >
            {roleLabels[role]}
            <ChevronDown size={14} className="text-ink-faint" />
          </button>
          {roleOpen && (
            <div className="absolute right-0 top-full mt-1 w-56 rounded-md border border-border bg-surface py-1 shadow-lg z-40">
              {(Object.keys(roleLabels) as Role[]).map((r) => (
                <button
                  key={r}
                  onMouseDown={() => setRole(r)}
                  className={`flex w-full items-center px-3 py-1.5 text-left text-[13px] hover:bg-surface-alt ${
                    r === role ? 'text-brand font-medium' : 'text-ink-soft'
                  }`}
                >
                  {roleLabels[r]}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
