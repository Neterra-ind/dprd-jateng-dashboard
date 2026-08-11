import type { FilterState } from '../context/FilterContext';
import type { DigitalAsset, ExecutiveContent, PimpinanAktivitas } from '../data';
import { isuById } from '../data/isuWilayah';
import { isWithinPeriode } from './filters';

function isuMatchesWilayah(isuId: string | undefined, wilayahId: string) {
  if (wilayahId === 'all') return true;
  if (!isuId) return false;
  return isuById(isuId)?.wilayahIds.includes(wilayahId) ?? false;
}

export function filterAktivitasLike(list: PimpinanAktivitas[], f: FilterState): PimpinanAktivitas[] {
  return list.filter((a) => {
    if (!isWithinPeriode(a.tanggal, f.periode)) return false;
    if (f.isuId !== 'all' && a.isuId !== f.isuId) return false;
    if (!isuMatchesWilayah(a.isuId, f.wilayahId)) return false;
    return true;
  });
}

export function filterExecutiveContent(list: ExecutiveContent[], f: FilterState): ExecutiveContent[] {
  return list.filter((c) => {
    if (!isWithinPeriode(c.tanggal, f.periode)) return false;
    if (f.isuId !== 'all' && c.isuId !== f.isuId) return false;
    if (!isuMatchesWilayah(c.isuId, f.wilayahId)) return false;
    if (f.platform !== 'all' && c.platform !== f.platform) return false;
    if (f.sentiment !== 'all' && c.sentiment !== f.sentiment) return false;
    return true;
  });
}

export function filterDigitalAssets(list: DigitalAsset[], f: FilterState): DigitalAsset[] {
  return list.filter((a) => {
    if (f.platform !== 'all' && a.platform !== f.platform) return false;
    if (f.isuId !== 'all' && a.topIssueId !== f.isuId) return false;
    return true;
  });
}
