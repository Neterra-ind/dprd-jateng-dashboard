import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';
import type { Sentiment, SosmedPlatform } from '../data';

export type Periode = '7d' | '30d' | '90d' | 'all';

export type Role = 'pimpinan' | 'anggota' | 'sekretariat' | 'tenaga_ahli' | 'admin';

export const roleLabels: Record<Role, string> = {
  pimpinan: 'Pimpinan DPRD',
  anggota: 'Anggota DPRD',
  sekretariat: 'Sekretariat DPRD',
  tenaga_ahli: 'Tenaga Ahli / Researcher',
  admin: 'Admin',
};

export interface FilterState {
  periode: Periode;
  wilayahId: string;
  komisiId: string;
  urusanId: string;
  opdId: string;
  isuId: string;
  anggotaId: string;
  sentiment: Sentiment | 'all';
  mediaId: string;
  platform: SosmedPlatform | 'all';
  search: string;
}

export const defaultFilters: FilterState = {
  periode: '30d',
  wilayahId: 'all',
  komisiId: 'all',
  urusanId: 'all',
  opdId: 'all',
  isuId: 'all',
  anggotaId: 'all',
  sentiment: 'all',
  mediaId: 'all',
  platform: 'all',
  search: '',
};

interface FilterContextValue {
  filters: FilterState;
  setFilter: <K extends keyof FilterState>(key: K, value: FilterState[K]) => void;
  resetFilters: () => void;
  activeCount: number;
  role: Role;
  setRole: (role: Role) => void;
}

const FilterContext = createContext<FilterContextValue | null>(null);

export function FilterProvider({ children }: { children: ReactNode }) {
  const [filters, setFilters] = useState<FilterState>(defaultFilters);
  const [role, setRole] = useState<Role>('pimpinan');

  const setFilter = <K extends keyof FilterState>(key: K, value: FilterState[K]) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const resetFilters = () => setFilters(defaultFilters);

  const activeCount = useMemo(() => {
    let count = 0;
    if (filters.periode !== defaultFilters.periode) count++;
    if (filters.wilayahId !== 'all') count++;
    if (filters.komisiId !== 'all') count++;
    if (filters.urusanId !== 'all') count++;
    if (filters.opdId !== 'all') count++;
    if (filters.isuId !== 'all') count++;
    if (filters.anggotaId !== 'all') count++;
    if (filters.sentiment !== 'all') count++;
    if (filters.mediaId !== 'all') count++;
    if (filters.platform !== 'all') count++;
    if (filters.search.trim() !== '') count++;
    return count;
  }, [filters]);

  return (
    <FilterContext.Provider value={{ filters, setFilter, resetFilters, activeCount, role, setRole }}>
      {children}
    </FilterContext.Provider>
  );
}

export function useFilters() {
  const ctx = useContext(FilterContext);
  if (!ctx) throw new Error('useFilters must be used within FilterProvider');
  return ctx;
}
