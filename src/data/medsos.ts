import type { SosmedPostAnggota, SosmedPostInstitution, SosmedPlatform, Sentiment } from './types';
import { hasFullProfile } from './types';
import { isuWilayahList } from './isuWilayah';
import { anggotaList } from './anggota';
import { seededRng, daysAgo } from '../lib/random';

const rng = seededRng(777);
const TODAY = '2026-08-10';
const platforms: SosmedPlatform[] = ['instagram', 'facebook', 'tiktok', 'youtube', 'twitter'];
const formats: Array<'foto' | 'video' | 'teks' | 'infografis' | 'reels'> = ['foto', 'video', 'teks', 'infografis', 'reels'];

const institutionCaptions = [
  'Rapat Paripurna DPRD Provinsi Jawa Tengah membahas {isu}.',
  'Kunjungan kerja Komisi terkait dalam rangka pengawasan {isu}.',
  'Dokumentasi kegiatan reses anggota DPRD menyerap aspirasi warga soal {isu}.',
  'Sosialisasi Perda dan penjelasan sikap DPRD terhadap {isu}.',
  'Infografis: Perkembangan penanganan {isu} versi DPRD Provinsi Jawa Tengah.',
];

const memberCaptions = [
  'Menyerap aspirasi warga terkait {isu} dalam kegiatan reses hari ini.',
  'Meninjau langsung kondisi lapangan terkait {isu}.',
  'Rapat dengar pendapat membahas {isu} bersama OPD terkait.',
  'Refleksi dan sikap saya terhadap {isu} yang berkembang di dapil.',
  'Dialog bersama warga soal {isu}, aspirasi akan saya kawal di DPRD.',
];

function fillCaption(t: string, isuNama: string) {
  return t.replace('{isu}', isuNama);
}

export const sosmedInstitution: SosmedPostInstitution[] = [];
let idxInst = 0;
for (let i = 0; i < 42; i++) {
  idxInst++;
  const isu = rng.pick(isuWilayahList);
  const sentiment: Sentiment = rng.bool(0.15) ? 'negative' : rng.bool(0.55) ? 'positive' : 'neutral';
  const views = rng.int(2000, 85000);
  sosmedInstitution.push({
    id: `sm-inst-${idxInst.toString().padStart(3, '0')}`,
    platform: rng.pick(platforms),
    tanggal: daysAgo(TODAY, rng.int(0, 45)),
    konten: fillCaption(rng.pick(institutionCaptions), isu.nama),
    format: rng.pick(formats),
    isuId: isu.id,
    likes: Math.round(views * rng.next() * 0.08),
    comments: Math.round(views * rng.next() * 0.01),
    shares: Math.round(views * rng.next() * 0.02),
    views,
    sentiment,
  });
}

export const sosmedAnggota: SosmedPostAnggota[] = [];
let idxMember = 0;
for (const a of anggotaList.filter(hasFullProfile)) {
  const postCount = rng.int(3, 6);
  for (let i = 0; i < postCount; i++) {
    idxMember++;
    const isuId = rng.pick(a.topIssueIds!);
    const isu = isuWilayahList.find((x) => x.id === isuId);
    const engagementFactor = (a.engagementScore ?? 0) / 100;
    const views = Math.round(rng.int(800, 22000) * (0.5 + engagementFactor));
    const sentiment: Sentiment = rng.bool(0.08) ? 'negative' : rng.bool(0.7) ? 'positive' : 'neutral';
    sosmedAnggota.push({
      id: `sm-member-${idxMember.toString().padStart(3, '0')}`,
      anggotaId: a.id,
      platform: rng.pick(platforms),
      tanggal: daysAgo(TODAY, rng.int(0, 45)),
      konten: fillCaption(rng.pick(memberCaptions), isu ? isu.nama : 'isu strategis daerah'),
      format: rng.pick(formats),
      isuId,
      likes: Math.round(views * (0.05 + engagementFactor * 0.1)),
      comments: Math.round(views * (0.005 + engagementFactor * 0.015)),
      shares: Math.round(views * (0.01 + engagementFactor * 0.02)),
      views,
      sentiment,
    });
  }
}

sosmedInstitution.sort((a, b) => (a.tanggal < b.tanggal ? 1 : -1));
sosmedAnggota.sort((a, b) => (a.tanggal < b.tanggal ? 1 : -1));
