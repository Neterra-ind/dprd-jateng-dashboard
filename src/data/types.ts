export type Sentiment = 'positive' | 'neutral' | 'negative';

export type Urgency = 'low' | 'medium' | 'high' | 'critical';

export type ResponseStatus = 'ada' | 'sebagian' | 'belum';

export type Trend = number; // percentage change, can be negative

export interface Wilayah {
  id: string;
  nama: string;
  tipe: 'kota' | 'kabupaten';
  dapil: string;
  penduduk: number;
}

export interface Dapil {
  id: string;
  nama: string;
  wilayahIds: string[];
}

export interface OPD {
  id: string;
  nama: string;
  singkatan: string;
  urusanId: string;
}

export interface Urusan {
  id: string;
  nama: string;
}

export interface Komisi {
  id: string;
  kode: string;
  nama: string;
  ruangLingkup: string;
  urusanIds: string[];
  opdIds: string[];
  ketua: string;
}

export interface Fraksi {
  id: string;
  nama: string;
  singkatan: string;
  kursiCount: number;
  warna: string;
}

export interface Anggota {
  id: string;
  nama: string;
  gelar?: string;
  foto?: string;
  fraksiId: string;
  /** Undefined for DPRD-level Pimpinan (Ketua/Wakil Ketua), who are not formally Komisi members. */
  komisiId?: string;
  dapilId: string;
  jabatan: string; // "Anggota", "Ketua Komisi", "Wakil Ketua DPRD", "Ketua DPRD", "Sekretaris Fraksi"
  periode: string;
  /**
   * Demo analytics (ekspos, sentiment, top issues, positioning, engagement) are only populated
   * for members with a full illustrative profile. Rank-and-file members imported as a roster-only
   * entry intentionally omit these fields rather than fabricate personal analytics for a real person.
   */
  totalEkspos?: number;
  sentimentPositive?: number;
  sentimentNeutral?: number;
  sentimentNegative?: number;
  topIssueIds?: string[];
  positioning?: string;
  engagementScore?: number;
}

export const hasFullProfile = (a: Pick<Anggota, 'positioning' | 'topIssueIds'>): boolean =>
  !!a.positioning && !!a.topIssueIds && a.topIssueIds.length > 0;

export interface IssueTimelineEntry {
  tanggal: string;
  judul: string;
  deskripsi: string;
  tipe: 'kejadian' | 'pemberitaan' | 'respons_pemda' | 'respons_dprd' | 'eskalasi';
}

export interface IsuWilayah {
  id: string;
  nama: string;
  kategori: string;
  ringkasan: string;
  volume: number;
  trend: Trend;
  sentiment: Sentiment;
  sentimentBreakdown: { positive: number; neutral: number; negative: number };
  urgency: Urgency;
  wilayahIds: string[];
  opdIds: string[];
  urusanId: string;
  komisiIds: string[];
  anggotaIds: string[];
  dampak: string[];
  statusResponsPemda: ResponseStatus;
  statusResponsDprd: ResponseStatus;
  catatanResponsPemda?: string;
  catatanResponsDprd?: string;
  timeline: IssueTimelineEntry[];
  strategic: boolean;
  emerging: boolean;
  updatedAt: string;
}

export interface Media {
  id: string;
  nama: string;
  tipe: 'online_nasional' | 'online_lokal' | 'cetak' | 'tv' | 'radio';
  reach: number;
  credibility: number; // 1-5
}

export interface Berita {
  id: string;
  headline: string;
  ringkasan: string;
  mediaId: string;
  tanggal: string;
  isuId: string;
  aktorUtama: string; // free text actor label
  anggotaIds: string[];
  komisiIds: string[];
  sentiment: Sentiment;
  tone: string;
  pernyataan?: string;
  sourceUrl: string;
  wilayahId?: string;
}

export type SosmedPlatform = 'facebook' | 'instagram' | 'tiktok' | 'youtube' | 'twitter';

export interface SosmedPostInstitution {
  id: string;
  platform: SosmedPlatform;
  tanggal: string;
  konten: string;
  format: 'foto' | 'video' | 'teks' | 'infografis' | 'reels';
  isuId?: string;
  likes: number;
  comments: number;
  shares: number;
  views: number;
  sentiment: Sentiment;
}

export interface SosmedPostAnggota {
  id: string;
  anggotaId: string;
  platform: SosmedPlatform;
  tanggal: string;
  konten: string;
  format: 'foto' | 'video' | 'teks' | 'infografis' | 'reels';
  isuId?: string;
  likes: number;
  comments: number;
  shares: number;
  views: number;
  sentiment: Sentiment;
}

export type AktivitasTipe =
  | 'rapat_komisi'
  | 'paripurna'
  | 'raperda'
  | 'perda'
  | 'pembahasan_apbd'
  | 'kunjungan_kerja'
  | 'reses_aspirasi'
  | 'pernyataan_pers'
  | 'rekomendasi';

export type FungsiDPRD = 'legislasi' | 'anggaran' | 'pengawasan';

export interface AktivitasDPRD {
  id: string;
  tipe: AktivitasTipe;
  fungsi: FungsiDPRD;
  judul: string;
  tanggal: string;
  komisiId?: string;
  anggotaIds: string[];
  deskripsi: string;
  status: 'selesai' | 'berjalan' | 'dijadwalkan';
  eksposMedia: number;
  isuId?: string;
}

export type RiskQuadrant = 'monitor' | 'attention' | 'manage' | 'strategic_issue';
export type RiskLevel = 'low' | 'medium' | 'high' | 'critical';

export interface NegativeIssueRisk {
  id: string;
  isuId: string;
  level: RiskLevel;
  mediaExposure: number; // 0-100 x-axis
  potentialImpact: number; // 0-100 y-axis
  quadrant: RiskQuadrant;
  analyticalRiskScore: number; // 0-100, labeled prototype
  indikatorVolume: number;
  indikatorSentiment: number;
  indikatorEngagement: number;
  indikatorTrend: number;
  politicalRelevance: 'low' | 'medium' | 'high';
  rekomendasi: string;
}

export type IntelligenceCategory =
  | 'strategic_issue'
  | 'emerging_issue'
  | 'oversight_gap'
  | 'reputation_risk'
  | 'personal_positioning';

export interface IntelligenceInsight {
  id: string;
  category: IntelligenceCategory;
  judul: string;
  evidence: string;
  trend: string;
  actors: string[];
  impact: string;
  relevance: string;
  recommendedAttention: string;
  isuId?: string;
  anggotaId?: string;
}

export interface OversightGapEntry {
  id: string;
  isuId: string;
  ekspos: 'low' | 'medium' | 'high';
  responsPemda: ResponseStatus;
  responsDprd: ResponseStatus;
  status: 'aligned' | 'oversight_gap' | 'monitoring';
  catatan: string;
}

// ===================== Pimpinan DPRD Executive Intelligence =====================

export type PimpinanFungsi = 'legislasi' | 'anggaran' | 'pengawasan' | 'representasi_publik' | 'kepemimpinan';

export interface PimpinanAktivitas {
  id: string;
  anggotaId: string;
  fungsi: PimpinanFungsi;
  judul: string;
  tanggal: string;
  deskripsi: string;
  isuId?: string;
  eksposMedia: number;
  sentimentPositive: number;
  publicEngagement: number;
}

export type DigitalPlatform = SosmedPlatform | 'website' | 'blog' | 'whatsapp' | 'podcast';
export type DigitalAssetStatus = 'active' | 'low_activity' | 'not_detected' | 'not_configured';

export interface DigitalAsset {
  id: string;
  anggotaId: string;
  platform: DigitalPlatform;
  status: DigitalAssetStatus;
  followers?: number;
  metricLabel?: string;
  activityPerMonth?: number;
  activityLabel?: string;
  engagementRate?: number;
  lastActivityDaysAgo?: number;
  topIssueId?: string;
  growth?: { label: string; value: number }[];
}

export interface ExecutiveContent {
  id: string;
  anggotaId: string;
  platform: DigitalPlatform;
  tanggal: string;
  format: string;
  topik: string;
  isuId?: string;
  views: number;
  engagement: number;
  engagementRate: number;
  sentiment: Sentiment;
  whyItPerformed: string;
}

export type AttentionTier = 'high_attention' | 'watch' | 'opportunity' | 'digital_asset';

export interface ExecutiveAttentionItem {
  id: string;
  anggotaId: string;
  tier: AttentionTier;
  issue: string;
  evidence: string;
  trend: string;
  relevance: string;
  recommendedAttention: string;
  isuId?: string;
}
