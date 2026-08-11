import type { OPD } from './types';

export const opdList: OPD[] = [
  { id: 'opd-pu', nama: 'Dinas Pekerjaan Umum & Penataan Ruang', singkatan: 'Dinas PU', urusanId: 'urusan-infrastruktur' },
  { id: 'opd-bpbd', nama: 'Badan Penanggulangan Bencana Daerah', singkatan: 'BPBD', urusanId: 'urusan-infrastruktur' },
  { id: 'opd-kesehatan', nama: 'Dinas Kesehatan', singkatan: 'Dinkes', urusanId: 'urusan-kesehatan' },
  { id: 'opd-pendidikan', nama: 'Dinas Pendidikan & Kebudayaan', singkatan: 'Disdikbud', urusanId: 'urusan-pendidikan' },
  { id: 'opd-sosial', nama: 'Dinas Sosial', singkatan: 'Dinsos', urusanId: 'urusan-sosial' },
  { id: 'opd-koperasi', nama: 'Dinas Koperasi & UKM', singkatan: 'Diskop UKM', urusanId: 'urusan-ekonomi' },
  { id: 'opd-perindustrian', nama: 'Dinas Perindustrian & Perdagangan', singkatan: 'Disperindag', urusanId: 'urusan-ekonomi' },
  { id: 'opd-lingkungan', nama: 'Dinas Lingkungan Hidup & Kehutanan', singkatan: 'DLHK', urusanId: 'urusan-lingkungan' },
  { id: 'opd-nakertrans', nama: 'Dinas Tenaga Kerja & Transmigrasi', singkatan: 'Disnakertrans', urusanId: 'urusan-tenagakerja' },
  { id: 'opd-pertanian', nama: 'Dinas Pertanian & Ketahanan Pangan', singkatan: 'Distan TPH', urusanId: 'urusan-pertanian' },
  { id: 'opd-perhubungan', nama: 'Dinas Perhubungan', singkatan: 'Dishub', urusanId: 'urusan-perhubungan' },
  { id: 'opd-satpolpp', nama: 'Satuan Polisi Pamong Praja', singkatan: 'Satpol PP', urusanId: 'urusan-ketertiban' },
  { id: 'opd-perumahan', nama: 'Dinas Perumahan Rakyat & Kawasan Permukiman', singkatan: 'Disperakim', urusanId: 'urusan-perumahan' },
  { id: 'opd-bkd', nama: 'Badan Kepegawaian Daerah', singkatan: 'BKD', urusanId: 'urusan-pemerintahan-umum' },
];

export const opdById = (id: string) => opdList.find((o) => o.id === id);
