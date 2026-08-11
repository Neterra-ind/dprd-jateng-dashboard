import type { PimpinanAktivitas, PimpinanFungsi } from './types';
import { anggotaList } from './anggota';
import { isuWilayahList } from './isuWilayah';
import { seededRng, daysAgo } from '../lib/random';

const rng = seededRng(909);
const TODAY = '2026-08-10';

const leadershipRank = ['Ketua DPRD', 'Wakil Ketua I', 'Wakil Ketua II', 'Wakil Ketua III', 'Wakil Ketua IV'];

export const leadershipList = anggotaList
  .filter((a) => leadershipRank.includes(a.jabatan))
  .sort((a, b) => leadershipRank.indexOf(a.jabatan) - leadershipRank.indexOf(b.jabatan));

const templates: Record<PimpinanFungsi, string[]> = {
  legislasi: [
    'Memimpin Rapat Pembahasan Raperda Inisiatif DPRD',
    'Rapat Paripurna Pengambilan Keputusan',
    'Penyampaian Pandangan Umum Fraksi',
    'Pengesahan Perda dalam Rapat Paripurna',
    'Penyusunan Agenda Legislasi Masa Sidang',
  ],
  anggaran: [
    'Memimpin Pembahasan KUA-PPAS',
    'Rapat Pimpinan soal Perubahan APBD',
    'Pembahasan Nota Keuangan Bersama Banggar',
    'Evaluasi Realisasi Anggaran Triwulan',
  ],
  pengawasan: [
    'Rapat Kerja Evaluasi Kebijakan Pemda',
    'Peninjauan Lapangan atas Respons Masalah Publik',
    'Pernyataan Sikap Pengawasan terhadap OPD',
    'Rapat Pimpinan Evaluasi Kinerja Komisi',
  ],
  representasi_publik: [
    'Dialog Publik dengan Tokoh Masyarakat',
    'Reses Masa Sidang di Dapil',
    'Menyerap Aspirasi Warga dalam Kunjungan Kerja',
    'Menghadiri Kegiatan Daerah dan Konstituen',
    'Kunjungan ke Fasilitas Publik',
  ],
  kepemimpinan: [
    'Memimpin Rapat Pimpinan DPRD',
    'Pernyataan Institusional Mewakili DPRD',
    'Koordinasi dengan Pemerintah Provinsi',
    'Koordinasi dengan Forkopimda',
    'Penyusunan Agenda Kelembagaan DPRD',
  ],
};

const fungsiList = Object.keys(templates) as PimpinanFungsi[];

export const pimpinanAktivitasList: PimpinanAktivitas[] = [];
let counter = 0;

for (const leader of leadershipList) {
  const relevantIsu = isuWilayahList.filter((i) => leader.topIssueIds?.includes(i.id));
  for (let month = 0; month < 6; month++) {
    const perMonth = rng.int(3, 6);
    for (let i = 0; i < perMonth; i++) {
      counter++;
      const fungsi = rng.pick(fungsiList);
      const judul = rng.pick(templates[fungsi]);
      const isu = relevantIsu.length > 0 ? rng.pick(relevantIsu) : rng.pick(isuWilayahList);
      const eksposMedia = rng.int(2, 26);
      pimpinanAktivitasList.push({
        id: `pakt-${counter.toString().padStart(4, '0')}`,
        anggotaId: leader.id,
        fungsi,
        judul,
        tanggal: daysAgo(TODAY, month * 30 + rng.int(0, 28)),
        deskripsi: `${judul} dilaksanakan oleh ${leader.jabatan} DPRD Provinsi Jawa Tengah dalam menjalankan peran ${fungsi.replace('_', ' ')}.`,
        isuId: isu.id,
        eksposMedia,
        sentimentPositive: rng.int(52, 92),
        publicEngagement: Math.round(eksposMedia * rng.int(120, 340)),
      });
    }
  }
}

pimpinanAktivitasList.sort((a, b) => (a.tanggal < b.tanggal ? 1 : -1));

export const pimpinanAktivitasByAnggota = (anggotaId: string) => pimpinanAktivitasList.filter((a) => a.anggotaId === anggotaId);
