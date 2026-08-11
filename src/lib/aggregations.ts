import type { AktivitasDPRD, Anggota, Berita, FungsiDPRD, IsuWilayah, SosmedPostAnggota, SosmedPostInstitution } from '../data';
import { mediaById } from '../data/media';
import { anggotaById } from '../data/anggota';
import { isuById } from '../data/isuWilayah';
import { komisiById, komisiList } from '../data/komisi';

export function formatCompact(n: number): string {
  return new Intl.NumberFormat('id-ID', { notation: 'compact', maximumFractionDigits: 1 }).format(n);
}

export function computeExecutiveKPIs(berita: Berita[], isu: IsuWilayah[], sosmedInst: SosmedPostInstitution[], sosmedMember: SosmedPostAnggota[]) {
  const dprdBerita = berita.filter((b) => b.anggotaIds.length > 0);
  const positif = dprdBerita.filter((b) => b.sentiment === 'positive').length;
  const negatif = dprdBerita.filter((b) => b.sentiment === 'negative').length;
  const engagement = [...sosmedInst, ...sosmedMember].reduce((sum, p) => sum + p.likes + p.comments + p.shares, 0);
  const shareOfVoice = berita.length > 0 ? Math.round((dprdBerita.length / berita.length) * 100) : 0;

  return {
    totalEksposDprd: dprdBerita.length,
    eksposPositif: positif,
    eksposNegatif: negatif,
    totalIsuWilayah: isu.length,
    isuStrategis: isu.filter((i) => i.strategic).length,
    isuNegatif: isu.filter((i) => i.sentiment === 'negative').length,
    socialEngagement: engagement,
    shareOfVoice,
  };
}

export function topIssuesByVolume(isu: IsuWilayah[], n = 10) {
  return [...isu].sort((a, b) => b.volume - a.volume).slice(0, n);
}

export function topMediaByVolume(berita: Berita[], n = 8) {
  const map = new Map<string, number>();
  for (const b of berita) map.set(b.mediaId, (map.get(b.mediaId) ?? 0) + 1);
  return [...map.entries()]
    .map(([mediaId, count]) => ({ mediaId, nama: mediaById(mediaId)?.nama ?? mediaId, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, n);
}

export function topAnggotaByEkspos(berita: Berita[], n = 8) {
  const map = new Map<string, number>();
  for (const b of berita) for (const aid of b.anggotaIds) map.set(aid, (map.get(aid) ?? 0) + 1);
  return [...map.entries()]
    .map(([anggotaId, count]) => ({ anggotaId, anggota: anggotaById(anggotaId), count }))
    .filter((x) => x.anggota)
    .sort((a, b) => b.count - a.count)
    .slice(0, n) as { anggotaId: string; anggota: Anggota; count: number }[];
}

export function topPersonalIssues(anggota: Anggota[], n = 8) {
  const map = new Map<string, number>();
  for (const a of anggota) {
    if (!a.topIssueIds || a.topIssueIds.length === 0) continue;
    for (const isuId of a.topIssueIds) {
      map.set(isuId, (map.get(isuId) ?? 0) + (a.totalEkspos ?? 0) / Math.max(1, a.topIssueIds.length));
    }
  }
  return [...map.entries()]
    .map(([isuId, weight]) => ({ isuId, isu: isuById(isuId), weight: Math.round(weight) }))
    .filter((x) => x.isu)
    .sort((a, b) => b.weight - a.weight)
    .slice(0, n) as { isuId: string; isu: IsuWilayah; weight: number }[];
}

export function sentimentDistribution(berita: Berita[]) {
  const total = berita.length || 1;
  const positive = berita.filter((b) => b.sentiment === 'positive').length;
  const neutral = berita.filter((b) => b.sentiment === 'neutral').length;
  const negative = berita.filter((b) => b.sentiment === 'negative').length;
  return {
    positive: Math.round((positive / total) * 100),
    neutral: Math.round((neutral / total) * 100),
    negative: Math.round((negative / total) * 100),
  };
}

const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];

export function monthlyActivitySeries(aktivitas: AktivitasDPRD[], months = 6) {
  const TODAY = new Date('2026-08-10');
  const buckets: { label: string; value: number }[] = [];
  for (let m = months - 1; m >= 0; m--) {
    const d = new Date(TODAY.getFullYear(), TODAY.getMonth() - m, 1);
    const count = aktivitas.filter((a) => {
      const ad = new Date(a.tanggal);
      return ad.getFullYear() === d.getFullYear() && ad.getMonth() === d.getMonth();
    }).length;
    buckets.push({ label: monthNames[d.getMonth()], value: count });
  }
  return buckets;
}

export function activityByKomisi(aktivitas: AktivitasDPRD[]) {
  return komisiList.map((k) => ({
    id: k.id,
    label: k.nama,
    value: aktivitas.filter((a) => a.komisiId === k.id).length,
  }));
}

export function activityByFungsi(aktivitas: AktivitasDPRD[]) {
  const fungsiLabel: Record<FungsiDPRD, string> = { legislasi: 'Legislasi', anggaran: 'Anggaran', pengawasan: 'Pengawasan' };
  return (Object.keys(fungsiLabel) as FungsiDPRD[]).map((f) => ({
    fungsi: f,
    label: fungsiLabel[f],
    value: aktivitas.filter((a) => a.fungsi === f).length,
    ekspos: aktivitas.filter((a) => a.fungsi === f).reduce((s, a) => s + a.eksposMedia, 0),
  }));
}

export function komisiAnalyticalScore(aktivitas: AktivitasDPRD[], berita: Berita[]) {
  return komisiList
    .map((k) => {
      const acts = aktivitas.filter((a) => a.komisiId === k.id);
      const ekspos = berita.filter((b) => b.komisiIds.includes(k.id)).length;
      const score = Math.min(100, Math.round(acts.length * 3.2 + ekspos * 0.6));
      return { id: k.id, nama: komisiById(k.id)?.nama ?? k.id, aktivitas: acts.length, ekspos, score };
    })
    .sort((a, b) => b.score - a.score);
}

const WEIGHT_SEQUENCE = [42, 27, 17, 9, 5];

export function issueWeightBreakdown(anggota: Anggota) {
  const n = anggota.topIssueIds?.length ?? 0;
  if (n === 0) return [];
  const raw = WEIGHT_SEQUENCE.slice(0, n);
  const sum = raw.reduce((s, v) => s + v, 0);
  return anggota.topIssueIds!.map((isuId, idx) => ({
    isuId,
    isu: isuById(isuId),
    pct: Math.round((raw[idx] / sum) * 100),
  }));
}

export function weeklyTrendSeries(berita: Berita[], weeks = 7) {
  const TODAY = new Date('2026-08-10');
  const buckets: { label: string; value: number; secondary: number }[] = [];
  for (let w = weeks - 1; w >= 0; w--) {
    const end = new Date(TODAY);
    end.setDate(end.getDate() - w * 7);
    const start = new Date(end);
    start.setDate(start.getDate() - 6);
    const inRange = berita.filter((b) => {
      const d = new Date(b.tanggal);
      return d >= start && d <= end;
    });
    buckets.push({
      label: `${start.getDate()}/${start.getMonth() + 1}`,
      value: inRange.length,
      secondary: inRange.filter((b) => b.sentiment === 'negative').length,
    });
  }
  return buckets;
}
