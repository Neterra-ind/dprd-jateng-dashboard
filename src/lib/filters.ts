import type { FilterState } from '../context/FilterContext';
import type { AktivitasDPRD, Anggota, Berita, IsuWilayah, SosmedPostAnggota, SosmedPostInstitution } from '../data';

const TODAY = new Date('2026-08-10');

export function periodeDays(periode: FilterState['periode']): number | null {
  if (periode === '7d') return 7;
  if (periode === '30d') return 30;
  if (periode === '90d') return 90;
  return null;
}

export function isWithinPeriode(dateStr: string, periode: FilterState['periode']): boolean {
  const days = periodeDays(periode);
  if (days === null) return true;
  const d = new Date(dateStr);
  const diff = (TODAY.getTime() - d.getTime()) / (1000 * 60 * 60 * 24);
  return diff >= 0 && diff <= days;
}

export function filterIsu(list: IsuWilayah[], f: FilterState): IsuWilayah[] {
  return list.filter((isu) => {
    if (!isWithinPeriode(isu.updatedAt, f.periode)) return false;
    if (f.wilayahId !== 'all' && !isu.wilayahIds.includes(f.wilayahId)) return false;
    if (f.komisiId !== 'all' && !isu.komisiIds.includes(f.komisiId)) return false;
    if (f.urusanId !== 'all' && isu.urusanId !== f.urusanId) return false;
    if (f.opdId !== 'all' && !isu.opdIds.includes(f.opdId)) return false;
    if (f.isuId !== 'all' && isu.id !== f.isuId) return false;
    if (f.anggotaId !== 'all' && !isu.anggotaIds.includes(f.anggotaId)) return false;
    if (f.sentiment !== 'all' && isu.sentiment !== f.sentiment) return false;
    if (f.search.trim() !== '' && !isu.nama.toLowerCase().includes(f.search.trim().toLowerCase())) return false;
    return true;
  });
}

export function filterBerita(list: Berita[], f: FilterState): Berita[] {
  return list.filter((b) => {
    if (!isWithinPeriode(b.tanggal, f.periode)) return false;
    if (f.wilayahId !== 'all' && b.wilayahId !== f.wilayahId) return false;
    if (f.komisiId !== 'all' && !b.komisiIds.includes(f.komisiId)) return false;
    if (f.isuId !== 'all' && b.isuId !== f.isuId) return false;
    if (f.anggotaId !== 'all' && !b.anggotaIds.includes(f.anggotaId)) return false;
    if (f.sentiment !== 'all' && b.sentiment !== f.sentiment) return false;
    if (f.mediaId !== 'all' && b.mediaId !== f.mediaId) return false;
    if (f.search.trim() !== '' && !b.headline.toLowerCase().includes(f.search.trim().toLowerCase())) return false;
    return true;
  });
}

export function filterAnggota(list: Anggota[], f: FilterState): Anggota[] {
  return list.filter((a) => {
    if (f.komisiId !== 'all' && a.komisiId !== f.komisiId) return false;
    if (f.anggotaId !== 'all' && a.id !== f.anggotaId) return false;
    if (f.isuId !== 'all' && !a.topIssueIds?.includes(f.isuId)) return false;
    if (f.search.trim() !== '' && !a.nama.toLowerCase().includes(f.search.trim().toLowerCase())) return false;
    return true;
  });
}

export function filterAktivitas(list: AktivitasDPRD[], f: FilterState): AktivitasDPRD[] {
  return list.filter((a) => {
    if (!isWithinPeriode(a.tanggal, f.periode)) return false;
    if (f.komisiId !== 'all' && a.komisiId !== f.komisiId) return false;
    if (f.anggotaId !== 'all' && !a.anggotaIds.includes(f.anggotaId)) return false;
    if (f.isuId !== 'all' && a.isuId !== f.isuId) return false;
    return true;
  });
}

export function filterSosmedInstitution(list: SosmedPostInstitution[], f: FilterState): SosmedPostInstitution[] {
  return list.filter((s) => {
    if (!isWithinPeriode(s.tanggal, f.periode)) return false;
    if (f.platform !== 'all' && s.platform !== f.platform) return false;
    if (f.isuId !== 'all' && s.isuId !== f.isuId) return false;
    if (f.sentiment !== 'all' && s.sentiment !== f.sentiment) return false;
    return true;
  });
}

export function filterSosmedAnggota(list: SosmedPostAnggota[], f: FilterState): SosmedPostAnggota[] {
  return list.filter((s) => {
    if (!isWithinPeriode(s.tanggal, f.periode)) return false;
    if (f.platform !== 'all' && s.platform !== f.platform) return false;
    if (f.anggotaId !== 'all' && s.anggotaId !== f.anggotaId) return false;
    if (f.isuId !== 'all' && s.isuId !== f.isuId) return false;
    if (f.sentiment !== 'all' && s.sentiment !== f.sentiment) return false;
    return true;
  });
}
