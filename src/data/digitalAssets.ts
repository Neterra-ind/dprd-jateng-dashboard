import type { DigitalAsset, DigitalPlatform } from './types';
import { seededRng } from '../lib/random';

const rng = seededRng(1313);
const months = ['Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu'];

function growthSeries(end: number, monthlyGrowthPct: number): { label: string; value: number }[] {
  const series: number[] = [end];
  for (let i = months.length - 2; i >= 0; i--) {
    const prev = series[series.length - 1] / (1 + monthlyGrowthPct / 100 + (rng.next() - 0.5) * 0.01);
    series.push(Math.round(prev));
  }
  series.reverse();
  return months.map((label, idx) => ({ label, value: series[idx] }));
}

function asset(
  id: string,
  anggotaId: string,
  platform: DigitalPlatform,
  partial: Partial<DigitalAsset> = {}
): DigitalAsset {
  return {
    id,
    anggotaId,
    platform,
    status: 'not_detected',
    ...partial,
  };
}

export const digitalAssetList: DigitalAsset[] = [
  // H. Sumanto, S.H. — Ketua DPRD (anggota-06)
  asset('da-06-ig', 'anggota-06', 'instagram', {
    status: 'active', followers: 68400, activityPerMonth: 22, activityLabel: 'posts/bulan', engagementRate: 6.2, lastActivityDaysAgo: 2,
    topIssueId: 'isu-investasi-jateng', growth: growthSeries(68400, 3.2),
  }),
  asset('da-06-fb', 'anggota-06', 'facebook', {
    status: 'active', followers: 52100, activityPerMonth: 16, activityLabel: 'posts/bulan', engagementRate: 3.4, lastActivityDaysAgo: 3,
    topIssueId: 'isu-banjir-rob', growth: growthSeries(52100, 1.6),
  }),
  asset('da-06-yt', 'anggota-06', 'youtube', {
    status: 'low_activity', followers: 6200, activityPerMonth: 2, activityLabel: 'video/bulan', engagementRate: 1.8, lastActivityDaysAgo: 18,
    topIssueId: 'isu-investasi-jateng', growth: growthSeries(6200, 0.8),
  }),
  asset('da-06-tw', 'anggota-06', 'twitter', {
    status: 'active', followers: 24800, activityPerMonth: 30, activityLabel: 'post/bulan', engagementRate: 2.9, lastActivityDaysAgo: 1,
    topIssueId: 'isu-banjir-rob', growth: growthSeries(24800, 2.1),
  }),
  asset('da-06-tt', 'anggota-06', 'tiktok', { status: 'not_detected' }),
  asset('da-06-web', 'anggota-06', 'website', {
    status: 'active', activityPerMonth: 3, activityLabel: 'artikel/bulan', metricLabel: '—', lastActivityDaysAgo: 6,
  }),
  asset('da-06-wa', 'anggota-06', 'whatsapp', {
    status: 'active', followers: 12400, activityPerMonth: 8, activityLabel: 'siaran/bulan', engagementRate: 4.1, lastActivityDaysAgo: 4,
  }),
  asset('da-06-podcast', 'anggota-06', 'podcast', { status: 'not_detected' }),
  asset('da-06-blog', 'anggota-06', 'blog', { status: 'not_configured' }),

  // H. Sarif Abdillah, S.Pdi. — Wakil Ketua I (anggota-07)
  asset('da-07-ig', 'anggota-07', 'instagram', {
    status: 'active', followers: 39600, activityPerMonth: 26, activityLabel: 'posts/bulan', engagementRate: 7.4, lastActivityDaysAgo: 1,
    topIssueId: 'isu-kekerasan-anak', growth: growthSeries(39600, 4.1),
  }),
  asset('da-07-fb', 'anggota-07', 'facebook', {
    status: 'active', followers: 21300, activityPerMonth: 10, activityLabel: 'posts/bulan', engagementRate: 2.6, lastActivityDaysAgo: 5,
    topIssueId: 'isu-bansos-tepat-sasaran', growth: growthSeries(21300, 1.4),
  }),
  asset('da-07-tt', 'anggota-07', 'tiktok', {
    status: 'active', followers: 18900, activityPerMonth: 14, activityLabel: 'video/bulan', engagementRate: 8.9, lastActivityDaysAgo: 2,
    topIssueId: 'isu-kekerasan-anak', growth: growthSeries(18900, 5.3),
  }),
  asset('da-07-tw', 'anggota-07', 'twitter', {
    status: 'low_activity', followers: 8100, activityPerMonth: 4, activityLabel: 'post/bulan', engagementRate: 1.2, lastActivityDaysAgo: 15,
    topIssueId: 'isu-bansos-tepat-sasaran', growth: growthSeries(8100, 0.6),
  }),
  asset('da-07-yt', 'anggota-07', 'youtube', { status: 'not_detected' }),
  asset('da-07-web', 'anggota-07', 'website', { status: 'not_configured' }),
  asset('da-07-wa', 'anggota-07', 'whatsapp', { status: 'not_configured' }),
  asset('da-07-podcast', 'anggota-07', 'podcast', { status: 'not_detected' }),
  asset('da-07-blog', 'anggota-07', 'blog', { status: 'not_configured' }),

  // Drs. Heri Pudyatmoko — Wakil Ketua II (anggota-08)
  asset('da-08-fb', 'anggota-08', 'facebook', {
    status: 'active', followers: 44700, activityPerMonth: 20, activityLabel: 'posts/bulan', engagementRate: 4.1, lastActivityDaysAgo: 2,
    topIssueId: 'isu-phk-tekstil', growth: growthSeries(44700, 2.3),
  }),
  asset('da-08-ig', 'anggota-08', 'instagram', {
    status: 'active', followers: 27900, activityPerMonth: 18, activityLabel: 'posts/bulan', engagementRate: 5.0, lastActivityDaysAgo: 3,
    topIssueId: 'isu-phk-tekstil', growth: growthSeries(27900, 2.8),
  }),
  asset('da-08-tw', 'anggota-08', 'twitter', {
    status: 'active', followers: 15600, activityPerMonth: 22, activityLabel: 'post/bulan', engagementRate: 3.6, lastActivityDaysAgo: 1,
    topIssueId: 'isu-pupuk-langka', growth: growthSeries(15600, 1.9),
  }),
  asset('da-08-yt', 'anggota-08', 'youtube', {
    status: 'low_activity', followers: 2100, activityPerMonth: 1, activityLabel: 'video/bulan', engagementRate: 0.9, lastActivityDaysAgo: 26,
    topIssueId: 'isu-phk-tekstil', growth: growthSeries(2100, 0.3),
  }),
  asset('da-08-tt', 'anggota-08', 'tiktok', { status: 'not_detected' }),
  asset('da-08-web', 'anggota-08', 'website', { status: 'not_configured' }),
  asset('da-08-wa', 'anggota-08', 'whatsapp', { status: 'not_configured' }),
  asset('da-08-podcast', 'anggota-08', 'podcast', { status: 'not_detected' }),
  asset('da-08-blog', 'anggota-08', 'blog', { status: 'not_configured' }),

  // Mohammad Saleh, S.T. — Wakil Ketua III (anggota-09)
  asset('da-09-fb', 'anggota-09', 'facebook', {
    status: 'active', followers: 26800, activityPerMonth: 9, activityLabel: 'posts/bulan', engagementRate: 2.1, lastActivityDaysAgo: 6,
    topIssueId: 'isu-tambang-ilegal', growth: growthSeries(26800, 1.1),
  }),
  asset('da-09-ig', 'anggota-09', 'instagram', {
    status: 'active', followers: 19200, activityPerMonth: 12, activityLabel: 'posts/bulan', engagementRate: 4.3, lastActivityDaysAgo: 4,
    topIssueId: 'isu-tambang-ilegal', growth: growthSeries(19200, 1.8),
  }),
  asset('da-09-tw', 'anggota-09', 'twitter', { status: 'not_detected' }),
  asset('da-09-yt', 'anggota-09', 'youtube', { status: 'not_detected' }),
  asset('da-09-tt', 'anggota-09', 'tiktok', { status: 'not_detected' }),
  asset('da-09-web', 'anggota-09', 'website', { status: 'not_configured' }),
  asset('da-09-wa', 'anggota-09', 'whatsapp', { status: 'not_configured' }),
  asset('da-09-podcast', 'anggota-09', 'podcast', { status: 'not_detected' }),
  asset('da-09-blog', 'anggota-09', 'blog', { status: 'not_configured' }),

  // Setya Arinugroho, A.Md. — Wakil Ketua IV (anggota-25)
  asset('da-25-fb', 'anggota-25', 'facebook', {
    status: 'active', followers: 22400, activityPerMonth: 11, activityLabel: 'posts/bulan', engagementRate: 2.8, lastActivityDaysAgo: 4,
    topIssueId: 'isu-macet-pantura', growth: growthSeries(22400, 1.3),
  }),
  asset('da-25-ig', 'anggota-25', 'instagram', {
    status: 'active', followers: 15800, activityPerMonth: 14, activityLabel: 'posts/bulan', engagementRate: 4.6, lastActivityDaysAgo: 3,
    topIssueId: 'isu-krisis-air-bersih', growth: growthSeries(15800, 2.0),
  }),
  asset('da-25-tw', 'anggota-25', 'twitter', {
    status: 'low_activity', followers: 5200, activityPerMonth: 3, activityLabel: 'post/bulan', engagementRate: 1.5, lastActivityDaysAgo: 20,
    topIssueId: 'isu-macet-pantura', growth: growthSeries(5200, 0.5),
  }),
  asset('da-25-yt', 'anggota-25', 'youtube', { status: 'not_detected' }),
  asset('da-25-tt', 'anggota-25', 'tiktok', { status: 'not_detected' }),
  asset('da-25-web', 'anggota-25', 'website', { status: 'not_configured' }),
  asset('da-25-wa', 'anggota-25', 'whatsapp', { status: 'not_configured' }),
  asset('da-25-podcast', 'anggota-25', 'podcast', { status: 'not_detected' }),
  asset('da-25-blog', 'anggota-25', 'blog', { status: 'not_configured' }),
];

export const digitalAssetsByAnggota = (anggotaId: string) => digitalAssetList.filter((a) => a.anggotaId === anggotaId);
