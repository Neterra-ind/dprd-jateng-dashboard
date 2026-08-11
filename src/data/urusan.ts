import type { Urusan } from './types';

export const urusanList: Urusan[] = [
  { id: 'urusan-infrastruktur', nama: 'Pekerjaan Umum & Penataan Ruang' },
  { id: 'urusan-kesehatan', nama: 'Kesehatan' },
  { id: 'urusan-pendidikan', nama: 'Pendidikan & Kebudayaan' },
  { id: 'urusan-sosial', nama: 'Sosial' },
  { id: 'urusan-ekonomi', nama: 'Koperasi, UKM & Perindustrian' },
  { id: 'urusan-lingkungan', nama: 'Lingkungan Hidup & Kehutanan' },
  { id: 'urusan-tenagakerja', nama: 'Ketenagakerjaan & Transmigrasi' },
  { id: 'urusan-pertanian', nama: 'Pertanian & Ketahanan Pangan' },
  { id: 'urusan-perhubungan', nama: 'Perhubungan' },
  { id: 'urusan-ketertiban', nama: 'Ketentraman & Ketertiban Umum' },
  { id: 'urusan-perumahan', nama: 'Perumahan Rakyat & Kawasan Permukiman' },
  { id: 'urusan-pemerintahan-umum', nama: 'Pemerintahan Umum & Kepegawaian' },
];

export const urusanById = (id: string) => urusanList.find((u) => u.id === id);
