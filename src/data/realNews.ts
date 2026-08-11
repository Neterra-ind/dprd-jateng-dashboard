import type { Berita, IssueTimelineEntry, Media, Sentiment, Urgency } from './types';
import raw from './realNews.json';

/**
 * Real scraped news data (2026-08-04 to 2026-08-11), sourced from two Excel exports:
 * "Data news isu - dprd_jateng" (145 articles) and "Data news isu - isu_jateng" (5,497 articles).
 * Isu/anggota linkage was derived via keyword matching against titles/content, so some
 * noise is expected — this is analytical classification, not manual editorial tagging.
 */

interface RawRecord {
  id: string;
  headline: string;
  ringkasan: string;
  mediaId: string;
  tanggal: string;
  isuId: string | null;
  aktorUtama: string | null;
  anggotaIds: string[];
  komisiIds: string[];
  sentiment: Sentiment;
  tone: string;
  sourceUrl: string;
  scope: 'dprd' | 'isu';
}

interface RawMedia {
  id: string;
  nama: string;
  tipe: Media['tipe'];
  reach: number;
  credibility: number;
}

interface RawIsuStat {
  volume: number;
  trend: number;
  sentimentBreakdown: { positive: number; neutral: number; negative: number };
  sentiment: Sentiment;
  urgency: Urgency;
  strategic: boolean;
  emerging: boolean;
  updatedAt: string;
  timeline: IssueTimelineEntry[];
}

const data = raw as {
  berita: RawRecord[];
  media: RawMedia[];
  isuStats: Record<string, RawIsuStat | null>;
};

export const realMediaList: Media[] = data.media.map((m) => ({
  id: m.id,
  nama: m.nama,
  tipe: m.tipe,
  reach: m.reach,
  credibility: m.credibility as 1 | 2 | 3 | 4 | 5,
}));

export const realBeritaList: Berita[] = data.berita.map((r) => ({
  id: r.id,
  headline: r.headline,
  ringkasan: r.ringkasan,
  mediaId: r.mediaId,
  tanggal: r.tanggal,
  isuId: r.isuId ?? undefined,
  aktorUtama: r.aktorUtama ?? 'Pemerintah Provinsi Jawa Tengah',
  anggotaIds: r.anggotaIds,
  komisiIds: r.komisiIds,
  sentiment: r.sentiment,
  tone: r.tone,
  sourceUrl: r.sourceUrl,
  isReal: true,
}));

export const realIsuStats: Record<string, RawIsuStat | null> = data.isuStats;
