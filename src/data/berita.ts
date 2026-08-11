import type { Berita, Sentiment } from './types';
import { isuWilayahList } from './isuWilayah';
import { fictionalMediaList } from './media';
import { wilayahById } from './wilayah';
import { opdById } from './opd';
import { komisiById } from './komisi';
import { anggotaById } from './anggota';
import { seededRng, daysAgo } from '../lib/random';
import { realBeritaList } from './realNews';

/**
 * The real scraped dataset (see realNews.ts) covers 16 of the 18 isu categories. These two
 * still use the illustrative synthetic generator below, clearly attributed only to the
 * fictional media outlets in media.ts (never to a real outlet).
 */
const SYNTHETIC_ONLY_ISU_IDS = new Set(['isu-banjir-rob', 'isu-jalan-rusak-non-pantura']);

const rng = seededRng(2026);
const TODAY = '2026-08-10';

const negativeTemplates = [
  '{isu} Masih Jadi Sorotan, Warga {wilayah} Keluhkan Penanganan Lambat',
  'DPRD Didesak Segera Respons Isu {isu} di {wilayah}',
  '{opd} Dinilai Lamban Tangani {isu}',
  'Sorotan Tajam Warganet soal {isu} di {wilayah}',
  'Komisi {komisi} Didesak Turun Tangan Atasi {isu}',
  'Warga {wilayah} Geruduk Kantor {opd} Terkait {isu}',
  'Kritik Mengalir soal Penanganan {isu} yang Dinilai Setengah Hati',
];

const positiveTemplates = [
  '{isu} Tunjukkan Perkembangan Positif di {wilayah}',
  'Warga {wilayah} Apresiasi Langkah Pemda soal {isu}',
  'Komisi {komisi} Apresiasi Capaian Program Terkait {isu}',
  '{opd} Klaim Progres Signifikan dalam Menangani {isu}',
  'Kolaborasi Pemda dan DPRD Dorong Percepatan Penanganan {isu}',
];

const neutralTemplates = [
  'Update: Perkembangan Penanganan {isu} di {wilayah}',
  '{opd} Paparkan Data Terbaru soal {isu}',
  'DPRD Gelar Rapat Dengar Pendapat Bahas {isu}',
  'Begini Penjelasan {opd} soal Kondisi Terkini {isu}',
];

const toneMap: Record<Sentiment, string[]> = {
  negative: ['Kritis', 'Investigatif', 'Provokatif'],
  positive: ['Apresiatif', 'Optimistis'],
  neutral: ['Informatif', 'Deskriptif'],
};

const pernyataanTemplates: Record<Sentiment, string[]> = {
  negative: [
    '"Kami minta OPD terkait tidak menunda-nunda lagi, masyarakat sudah terlalu lama menunggu," tegas {nama}.',
    '"Ini harus jadi perhatian serius, jangan sampai berlarut-larut tanpa kejelasan," ujar {nama}.',
    '"DPRD akan memanggil dinas terkait jika progres tidak terlihat dalam waktu dekat," kata {nama}.',
  ],
  positive: [
    '"Ini capaian yang patut diapresiasi, semoga bisa terus ditingkatkan," ujar {nama}.',
    '"Kami mendukung penuh langkah ini dan akan kawal implementasinya," kata {nama}.',
  ],
  neutral: [
    '"Kami masih menunggu laporan lengkap dari OPD terkait sebelum mengambil sikap," ujar {nama}.',
    '"Perlu kajian lebih mendalam sebelum ada rekomendasi lanjutan," kata {nama}.',
  ],
};

function fill(template: string, vars: Record<string, string>) {
  return template.replace(/\{(\w+)\}/g, (_, k) => vars[k] ?? '');
}

function slugify(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

const syntheticBerita: Berita[] = [];

let counter = 0;
for (const isu of isuWilayahList.filter((i) => SYNTHETIC_ONLY_ISU_IDS.has(i.id))) {
  const newsCount = Math.max(3, Math.min(9, Math.round(isu.volume / 140)));
  for (let i = 0; i < newsCount; i++) {
    counter++;
    const roll = rng.next();
    const sentiment: Sentiment =
      roll < isu.sentimentBreakdown.negative / 100
        ? 'negative'
        : roll < (isu.sentimentBreakdown.negative + isu.sentimentBreakdown.neutral) / 100
          ? 'neutral'
          : 'positive';

    const templates = sentiment === 'negative' ? negativeTemplates : sentiment === 'positive' ? positiveTemplates : neutralTemplates;
    const template = rng.pick(templates);
    const wilayah = wilayahById(rng.pick(isu.wilayahIds)) ?? wilayahById(isu.wilayahIds[0])!;
    const opd = opdById(rng.pick(isu.opdIds)) ?? opdById(isu.opdIds[0])!;
    const komisi = komisiById(rng.pick(isu.komisiIds)) ?? komisiById(isu.komisiIds[0])!;
    const media = rng.pick(fictionalMediaList);

    const anggotaId = isu.anggotaIds.length > 0 && rng.bool(0.55) ? rng.pick(isu.anggotaIds) : undefined;
    const anggota = anggotaId ? anggotaById(anggotaId) : undefined;

    const headline = fill(template, {
      isu: isu.nama,
      wilayah: wilayah.nama,
      opd: opd.singkatan,
      komisi: komisi.nama,
    });

    const pernyataan = anggota
      ? fill(rng.pick(pernyataanTemplates[sentiment]), { nama: anggota.nama.split(',')[0] })
      : undefined;

    const tanggal = daysAgo(TODAY, rng.int(0, 42));

    syntheticBerita.push({
      id: `berita-${counter.toString().padStart(4, '0')}`,
      headline,
      ringkasan: `${isu.ringkasan} Perkembangan ini menjadi perhatian ${opd.singkatan} dan ${komisi.nama} DPRD Provinsi Jawa Tengah.`,
      mediaId: media.id,
      tanggal,
      isuId: isu.id,
      aktorUtama: anggota ? anggota.nama.split(',')[0] : opd.singkatan,
      anggotaIds: anggota ? [anggota.id] : [],
      komisiIds: [komisi.id],
      sentiment,
      tone: rng.pick(toneMap[sentiment]),
      pernyataan,
      sourceUrl: `https://${slugify(media.nama)}.id/berita/${slugify(headline)}-${counter}`,
      wilayahId: wilayah.id,
    });
  }
}

export const beritaList: Berita[] = [...realBeritaList, ...syntheticBerita].sort((a, b) =>
  a.tanggal < b.tanggal ? 1 : -1
);

export const beritaById = (id: string) => beritaList.find((b) => b.id === id);
