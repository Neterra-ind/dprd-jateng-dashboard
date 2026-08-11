import type { AktivitasDPRD, AktivitasTipe, FungsiDPRD } from './types';
import { komisiList } from './komisi';
import { anggotaList } from './anggota';
import { isuWilayahList } from './isuWilayah';
import { seededRng, daysAgo } from '../lib/random';

const rng = seededRng(555);
const TODAY = '2026-08-10';

const tipeConfig: Record<AktivitasTipe, { fungsi: FungsiDPRD; titles: string[] }> = {
  rapat_komisi: {
    fungsi: 'pengawasan',
    titles: ['Rapat Kerja dengan {opd}', 'Rapat Dengar Pendapat soal {isu}', 'Rapat Internal Komisi Evaluasi Program'],
  },
  paripurna: {
    fungsi: 'legislasi',
    titles: ['Rapat Paripurna Penyampaian Pandangan Umum Fraksi', 'Rapat Paripurna Pengesahan Perda', 'Rapat Paripurna Nota Keuangan'],
  },
  raperda: {
    fungsi: 'legislasi',
    titles: ['Pembahasan Raperda Inisiatif DPRD', 'Harmonisasi Raperda dengan Biro Hukum', 'Uji Publik Rancangan Perda'],
  },
  perda: {
    fungsi: 'legislasi',
    titles: ['Pengesahan Perda tentang Penyelenggaraan Pelayanan Publik', 'Pengesahan Perda Perubahan Struktur OPD', 'Pengesahan Perda Ketenagakerjaan Daerah'],
  },
  pembahasan_apbd: {
    fungsi: 'anggaran',
    titles: ['Pembahasan KUA-PPAS', 'Pembahasan APBD Perubahan', 'Rapat Banggar soal Realisasi Anggaran'],
  },
  kunjungan_kerja: {
    fungsi: 'pengawasan',
    titles: ['Kunjungan Kerja Lapangan terkait {isu}', 'Kunjungan Kerja ke OPD {opd}', 'Sidak Lapangan Komisi'],
  },
  reses_aspirasi: {
    fungsi: 'pengawasan',
    titles: ['Reses Masa Sidang Menyerap Aspirasi Warga', 'Forum Aspirasi Konstituen Dapil'],
  },
  pernyataan_pers: {
    fungsi: 'pengawasan',
    titles: ['Konferensi Pers Sikap DPRD terhadap {isu}', 'Pernyataan Resmi Komisi soal {isu}'],
  },
  rekomendasi: {
    fungsi: 'pengawasan',
    titles: ['Rekomendasi Resmi kepada Pemda soal {isu}', 'Surat Rekomendasi Percepatan Penanganan {isu}'],
  },
};

const tipeList = Object.keys(tipeConfig) as AktivitasTipe[];

function fill(t: string, isuNama: string, opdLabel: string) {
  return t.replace('{isu}', isuNama).replace('{opd}', opdLabel);
}

export const aktivitasList: AktivitasDPRD[] = [];
let counter = 0;
for (let month = 0; month < 6; month++) {
  const perMonth = rng.int(10, 15);
  for (let i = 0; i < perMonth; i++) {
    counter++;
    const tipe = rng.pick(tipeList);
    const cfg = tipeConfig[tipe];
    const komisi = rng.pick(komisiList);
    const isu = rng.pick(isuWilayahList.filter((x) => x.komisiIds.includes(komisi.id))) ?? rng.pick(isuWilayahList);
    const members = anggotaList.filter((a) => a.komisiId === komisi.id);
    const participants = rng.pickMultiple(members, Math.min(members.length, rng.int(2, 4))).map((m) => m.id);
    const title = fill(rng.pick(cfg.titles), isu.nama, komisi.ruangLingkup.split(',')[0]);

    aktivitasList.push({
      id: `akt-${counter.toString().padStart(4, '0')}`,
      tipe,
      fungsi: cfg.fungsi,
      judul: title,
      tanggal: daysAgo(TODAY, month * 30 + rng.int(0, 28)),
      komisiId: komisi.id,
      anggotaIds: participants,
      deskripsi: `Kegiatan ${title.toLowerCase()} dilaksanakan oleh ${komisi.nama} DPRD Provinsi Jawa Tengah dalam rangka menjalankan fungsi ${cfg.fungsi}.`,
      status: month === 0 && i < 3 ? 'berjalan' : 'selesai',
      eksposMedia: rng.int(1, 24),
      isuId: isu.id,
    });
  }
}

aktivitasList.sort((a, b) => (a.tanggal < b.tanggal ? 1 : -1));

export const aktivitasById = (id: string) => aktivitasList.find((a) => a.id === id);
