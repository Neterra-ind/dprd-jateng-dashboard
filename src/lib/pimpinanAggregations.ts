import type { Anggota, DigitalAsset, PimpinanAktivitas, PimpinanFungsi, RiskLevel } from '../data';
import { isuById } from '../data/isuWilayah';
import { beritaList } from '../data/berita';
import { sosmedAnggota } from '../data/medsos';
import { digitalAssetsByAnggota } from '../data/digitalAssets';
import { executiveContentByAnggota } from '../data/executiveContent';
import { pimpinanAktivitasByAnggota } from '../data/pimpinanAktivitas';
import { formatCompact } from './aggregations';
import { isWithinPeriode } from './filters';
import type { Periode } from '../context/FilterContext';

const configuredStatuses = new Set(['active', 'low_activity']);

export function computePimpinanKPIs(anggota: Anggota, periode: Periode) {
  const berita = beritaList.filter((b) => b.anggotaIds.includes(anggota.id) && isWithinPeriode(b.tanggal, periode));
  const aktivitas = pimpinanAktivitasByAnggota(anggota.id).filter((a) => isWithinPeriode(a.tanggal, periode));
  const content = executiveContentByAnggota(anggota.id).filter((c) => isWithinPeriode(c.tanggal, periode));
  const posts = sosmedAnggota.filter((p) => p.anggotaId === anggota.id && isWithinPeriode(p.tanggal, periode));
  const assets = digitalAssetsByAnggota(anggota.id).filter((a) => configuredStatuses.has(a.status));

  const strategicIssueIds = new Set(
    [...aktivitas.map((a) => a.isuId), ...(anggota.topIssueIds ?? [])].filter((id): id is string => !!id && !!isuById(id)?.strategic)
  );

  const publicEngagement =
    aktivitas.reduce((s, a) => s + a.publicEngagement, 0) +
    content.reduce((s, c) => s + c.engagement, 0) +
    posts.reduce((s, p) => s + p.likes + p.comments + p.shares, 0);

  const digitalReach = assets.reduce((s, a) => s + (a.followers ?? 0), 0);
  const reputation = anggota.sentimentPositive ?? 0;
  const risk = computeDigitalRisk(anggota);

  return {
    executiveExposure: berita.length,
    performanceActivity: aktivitas.length,
    strategicIssues: strategicIssueIds.size,
    publicEngagement,
    publicEngagementLabel: formatCompact(publicEngagement),
    digitalAssets: assets.length,
    digitalReach,
    digitalReachLabel: formatCompact(digitalReach),
    reputation,
    digitalRisk: risk.level,
  };
}

const fungsiLabel: Record<PimpinanFungsi, string> = {
  legislasi: 'Legislasi',
  anggaran: 'Anggaran',
  pengawasan: 'Pengawasan',
  representasi_publik: 'Representasi Publik',
  kepemimpinan: 'Kepemimpinan DPRD',
};

export function activityByCategory(aktivitas: PimpinanAktivitas[]) {
  return (Object.keys(fungsiLabel) as PimpinanFungsi[]).map((f) => {
    const items = aktivitas.filter((a) => a.fungsi === f);
    return {
      fungsi: f,
      label: fungsiLabel[f],
      value: items.length,
      ekspos: items.reduce((s, a) => s + a.eksposMedia, 0),
      publicEngagement: items.reduce((s, a) => s + a.publicEngagement, 0),
    };
  });
}

const months6 = ['Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu'];

export function activityMonthlySeries(aktivitas: PimpinanAktivitas[]) {
  const TODAY = new Date('2026-08-10');
  const buckets: { label: string; value: number }[] = [];
  for (let m = months6.length - 1; m >= 0; m--) {
    const d = new Date(TODAY.getFullYear(), TODAY.getMonth() - m, 1);
    const count = aktivitas.filter((a) => {
      const ad = new Date(a.tanggal);
      return ad.getFullYear() === d.getFullYear() && ad.getMonth() === d.getMonth();
    }).length;
    buckets.push({ label: months6[months6.length - 1 - m], value: count });
  }
  return buckets;
}

export function executivePerformanceScore(aktivitas: PimpinanAktivitas[]) {
  const ekspos = aktivitas.reduce((s, a) => s + a.eksposMedia, 0);
  const engagement = aktivitas.reduce((s, a) => s + a.publicEngagement, 0);
  return Math.min(100, Math.round(aktivitas.length * 1.4 + ekspos * 0.35 + engagement / 4000));
}

export function digitalAssetHealth(assets: DigitalAsset[]) {
  const tracked = assets.length;
  const configured = assets.filter((a) => configuredStatuses.has(a.status));
  const presenceScore = tracked > 0 ? (configured.length / tracked) * 100 : 0;
  const activeScore = tracked > 0 ? (assets.filter((a) => a.status === 'active').length / tracked) * 100 : 0;
  const avgEngagement = configured.length
    ? configured.reduce((s, a) => s + (a.engagementRate ?? 0), 0) / configured.length
    : 0;
  const engagementScore = Math.min(100, avgEngagement * 10);
  const freshness = configured.length
    ? configured.reduce((s, a) => s + Math.max(0, 100 - (a.lastActivityDaysAgo ?? 30) * 3), 0) / configured.length
    : 0;

  const score = Math.round(presenceScore * 0.25 + activeScore * 0.25 + engagementScore * 0.25 + freshness * 0.25);
  const status = score >= 80 ? 'Excellent' : score >= 60 ? 'Good' : score >= 35 ? 'Needs Attention' : 'Critical';
  return { score, status };
}

export function crossPlatformConsistency(assets: DigitalAsset[]) {
  const configured = assets.filter((a) => configuredStatuses.has(a.status) && a.topIssueId);
  if (configured.length === 0) {
    return { status: 'Belum Cukup Data', narrative: 'Belum tersedia cukup data topik konten lintas platform untuk dianalisis.', breakdown: [] };
  }
  const counts = new Map<string, number>();
  for (const a of configured) counts.set(a.topIssueId!, (counts.get(a.topIssueId!) ?? 0) + 1);
  const dominant = [...counts.entries()].sort((a, b) => b[1] - a[1])[0];
  const ratio = dominant[1] / configured.length;
  const status = ratio >= 0.75 ? 'Highly Consistent' : ratio >= 0.45 ? 'Moderately Consistent' : 'Fragmented';

  const breakdown = configured.map((a) => ({ platform: a.platform, isuNama: isuById(a.topIssueId!)?.nama ?? '' }));
  const dominantIsu = isuById(dominant[0])?.nama ?? '';
  const others = [...counts.entries()].filter(([id]) => id !== dominant[0]).map(([id]) => isuById(id)?.nama).filter(Boolean);

  const narrative =
    others.length > 0
      ? `Isu ${dominantIsu} dominan pada sebagian besar platform, sementara sebagian kanal lain lebih banyak mengangkat isu ${others.join(', ')}.`
      : `Isu ${dominantIsu} konsisten diangkat di seluruh platform digital yang aktif.`;

  return { status, narrative, breakdown };
}

export function contentIssueMatrixData(anggotaId: string) {
  const content = executiveContentByAnggota(anggotaId);
  const maxEngagement = Math.max(...content.map((c) => c.engagement), 1);
  return content.map((c) => {
    const isu = c.isuId ? isuById(c.isuId) : undefined;
    const relevance = isu?.strategic ? 90 : isu?.emerging ? 65 : 40;
    const engagementNorm = Math.round((c.engagement / maxEngagement) * 100);
    let quadrant: 'priority' | 'improve' | 'audience_opportunity' | 'low_priority';
    if (relevance >= 60 && engagementNorm >= 50) quadrant = 'priority';
    else if (relevance >= 60 && engagementNorm < 50) quadrant = 'improve';
    else if (relevance < 60 && engagementNorm >= 50) quadrant = 'audience_opportunity';
    else quadrant = 'low_priority';
    return { ...c, isuNama: isu?.nama, x: engagementNorm, y: relevance, quadrant };
  });
}

export function digitalAssetVsPersonalIssue(anggotaId: string) {
  const assets = digitalAssetsByAnggota(anggotaId).filter((a) => configuredStatuses.has(a.status) && a.topIssueId);
  return assets
    .map((a) => {
      const engagementLevel = (a.engagementRate ?? 0) >= 6 ? 'High' : (a.engagementRate ?? 0) >= 3 ? 'Medium' : 'Low';
      return { platform: a.platform, isu: isuById(a.topIssueId!), engagementLevel, engagementRate: a.engagementRate ?? 0 };
    })
    .sort((a, b) => b.engagementRate - a.engagementRate);
}

export function computeDigitalRisk(anggota: Anggota): { level: RiskLevel; score: number } {
  const exposure = Math.min(100, (anggota.totalEkspos ?? 0) / 10);
  const sentimentNeg = anggota.sentimentNegative ?? 0;
  const contentEngagementAvg =
    executiveContentByAnggota(anggota.id).reduce((s, c) => s + c.engagementRate, 0) /
    Math.max(1, executiveContentByAnggota(anggota.id).length);
  const negativeContentShare =
    (executiveContentByAnggota(anggota.id).filter((c) => c.sentiment === 'negative').length /
      Math.max(1, executiveContentByAnggota(anggota.id).length)) *
    100;

  const score = Math.round(exposure * 0.25 + sentimentNeg * 0.4 + negativeContentShare * 0.25 + contentEngagementAvg * 0.5);
  const level: RiskLevel = score >= 55 ? 'critical' : score >= 35 ? 'high' : score >= 18 ? 'medium' : 'low';
  return { level, score: Math.min(100, score) };
}

const trendMonths = ['Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu'];

export function engagementTrendSeries(asset: DigitalAsset) {
  const end = asset.engagementRate ?? 0;
  const series: number[] = [end];
  let seed = end * 97 + asset.id.length;
  for (let i = trendMonths.length - 2; i >= 0; i--) {
    seed = (seed * 9301 + 49297) % 233280;
    const noise = (seed / 233280 - 0.5) * 0.6;
    const prev = Math.max(0.2, series[series.length - 1] - 0.35 - noise);
    series.push(Math.round(prev * 10) / 10);
  }
  series.reverse();
  return trendMonths.map((label, idx) => ({ label, value: series[idx] }));
}

export function issueConsistency(anggota: Anggota) {
  const aktivitas = pimpinanAktivitasByAnggota(anggota.id);
  const content = executiveContentByAnggota(anggota.id);
  const topIssueIds = anggota.topIssueIds ?? [];
  return topIssueIds.map((isuId) => {
    const months = new Set<string>();
    for (const a of aktivitas) if (a.isuId === isuId) months.add(a.tanggal.slice(0, 7));
    for (const c of content) if (c.isuId === isuId) months.add(c.tanggal.slice(0, 7));
    const pct = Math.min(100, Math.round((months.size / 6) * 100) + (isuId === topIssueIds[0] ? 20 : 0));
    return { isuId, isu: isuById(isuId), pct: Math.min(100, pct) };
  });
}

export function personalPositioningIndicators(anggota: Anggota) {
  const breakdown = issueConsistency(anggota);
  const avgConsistency = breakdown.length ? Math.round(breakdown.reduce((s, b) => s + b.pct, 0) / breakdown.length) : 0;
  const positioningStrength = Math.min(100, Math.round((anggota.sentimentPositive ?? 0) * 0.7 + avgConsistency * 0.3));
  const mediaVisibility = Math.min(100, Math.round(((anggota.totalEkspos ?? 0) / 900) * 100));
  const publicEngagementScore = Math.min(100, anggota.engagementScore ?? 0);

  return {
    positioningStrength,
    issueConsistency: avgConsistency,
    mediaVisibility,
    publicEngagement: publicEngagementScore,
  };
}

export function topAudienceResponse(anggota: Anggota) {
  const content = executiveContentByAnggota(anggota.id);
  const aktivitas = pimpinanAktivitasByAnggota(anggota.id);
  const map = new Map<string, number>();
  for (const c of content) if (c.isuId) map.set(c.isuId, (map.get(c.isuId) ?? 0) + c.engagement);
  for (const a of aktivitas) if (a.isuId) map.set(a.isuId, (map.get(a.isuId) ?? 0) + a.publicEngagement);
  return [...map.entries()]
    .map(([isuId, engagement]) => ({ isuId, isu: isuById(isuId), engagement }))
    .filter((x) => x.isu)
    .sort((a, b) => b.engagement - a.engagement);
}
