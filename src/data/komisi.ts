import type { Komisi } from './types';

export const komisiList: Komisi[] = [
  {
    id: 'komisi-a',
    kode: 'A',
    nama: 'Komisi A',
    ruangLingkup: 'Pemerintahan, Keamanan, Ketertiban, Hukum, Perizinan & Pertanahan',
    urusanIds: ['urusan-pemerintahan-umum', 'urusan-ketertiban'],
    opdIds: ['opd-satpolpp', 'opd-bkd'],
    ketua: 'Imam Teguh Purnomo, S.E., Akt.',
  },
  {
    id: 'komisi-b',
    kode: 'B',
    nama: 'Komisi B',
    ruangLingkup: 'Perindustrian, Perdagangan, Pertanian, Pariwisata & Koperasi',
    urusanIds: ['urusan-ekonomi', 'urusan-tenagakerja', 'urusan-pertanian'],
    opdIds: ['opd-koperasi', 'opd-perindustrian', 'opd-nakertrans', 'opd-pertanian'],
    ketua: 'Hj. Sri Hartini, S.T.',
  },
  {
    id: 'komisi-c',
    kode: 'C',
    nama: 'Komisi C',
    ruangLingkup: 'Keuangan Daerah, Perbankan & BUMD',
    urusanIds: ['urusan-pemerintahan-umum'],
    opdIds: ['opd-bkd'],
    ketua: 'Bambang Hariyanto B.',
  },
  {
    id: 'komisi-d',
    kode: 'D',
    nama: 'Komisi D',
    ruangLingkup: 'Bina Marga, Tata Ruang & Perumahan',
    urusanIds: ['urusan-infrastruktur', 'urusan-perhubungan', 'urusan-perumahan', 'urusan-lingkungan'],
    opdIds: ['opd-pu', 'opd-bpbd', 'opd-perhubungan', 'opd-perumahan', 'opd-lingkungan'],
    ketua: 'Hj. Nur Saadah, S.Pd.I., M.H.',
  },
  {
    id: 'komisi-e',
    kode: 'E',
    nama: 'Komisi E',
    ruangLingkup: 'Pendidikan, Kesehatan & Ketenagakerjaan',
    urusanIds: ['urusan-kesehatan', 'urusan-pendidikan', 'urusan-sosial'],
    opdIds: ['opd-kesehatan', 'opd-pendidikan', 'opd-sosial'],
    ketua: 'Dr. Messy Widiastuti, M.A.R.S.',
  },
];

export const komisiById = (id?: string) => komisiList.find((k) => k.id === id);
