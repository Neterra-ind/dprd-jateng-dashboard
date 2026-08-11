import type { Fraksi } from './types';

export const fraksiList: Fraksi[] = [
  { id: 'fraksi-pdip', nama: 'Fraksi PDI Perjuangan', singkatan: 'F-PDIP', kursiCount: 26, warna: '#c22f3d' },
  { id: 'fraksi-golkar', nama: 'Fraksi Partai Golkar', singkatan: 'F-Golkar', kursiCount: 13, warna: '#c99a2e' },
  { id: 'fraksi-gerindra', nama: 'Fraksi Gerindra', singkatan: 'F-Gerindra', kursiCount: 12, warna: '#8a6d1f' },
  { id: 'fraksi-pkb', nama: 'Fraksi Kebangkitan Bangsa', singkatan: 'F-PKB', kursiCount: 11, warna: '#1a8754' },
  { id: 'fraksi-pks', nama: 'Fraksi Keadilan Sejahtera', singkatan: 'F-PKS', kursiCount: 8, warna: '#1e4d8c' },
  { id: 'fraksi-nasdem', nama: 'Fraksi NasDem', singkatan: 'F-NasDem', kursiCount: 7, warna: '#d16a2c' },
  { id: 'fraksi-demokrat', nama: 'Fraksi Partai Demokrat', singkatan: 'F-Demokrat', kursiCount: 6, warna: '#2e6bb8' },
  { id: 'fraksi-pan', nama: 'Fraksi Amanat Nasional', singkatan: 'F-PAN', kursiCount: 5, warna: '#4b8c5e' },
  { id: 'fraksi-ppp', nama: 'Fraksi Persatuan Pembangunan', singkatan: 'F-PPP', kursiCount: 4, warna: '#6b5b95' },
  { id: 'fraksi-unconfirmed', nama: 'Belum Dikonfirmasi', singkatan: 'Belum Dikonfirmasi', kursiCount: 0, warna: '#94a3b8' },
];

export const fraksiById = (id: string) => fraksiList.find((f) => f.id === id);
