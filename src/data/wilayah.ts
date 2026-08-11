import type { Wilayah } from './types';

export const wilayahList: Wilayah[] = [
  { id: 'wil-semarang-kota', nama: 'Kota Semarang', tipe: 'kota', dapil: 'Dapil I', penduduk: 1668101 },
  { id: 'wil-surakarta', nama: 'Kota Surakarta', tipe: 'kota', dapil: 'Dapil VI', penduduk: 522364 },
  { id: 'wil-cilacap', nama: 'Kabupaten Cilacap', tipe: 'kabupaten', dapil: 'Dapil X', penduduk: 1962968 },
  { id: 'wil-banyumas', nama: 'Kabupaten Banyumas', tipe: 'kabupaten', dapil: 'Dapil IX', penduduk: 1806399 },
  { id: 'wil-kudus', nama: 'Kabupaten Kudus', tipe: 'kabupaten', dapil: 'Dapil IV', penduduk: 878413 },
  { id: 'wil-pekalongan-kota', nama: 'Kota Pekalongan', tipe: 'kota', dapil: 'Dapil III', penduduk: 316134 },
  { id: 'wil-jepara', nama: 'Kabupaten Jepara', tipe: 'kabupaten', dapil: 'Dapil IV', penduduk: 1252939 },
  { id: 'wil-grobogan', nama: 'Kabupaten Grobogan', tipe: 'kabupaten', dapil: 'Dapil V', penduduk: 1454929 },
  { id: 'wil-brebes', nama: 'Kabupaten Brebes', tipe: 'kabupaten', dapil: 'Dapil II', penduduk: 1985717 },
  { id: 'wil-demak', nama: 'Kabupaten Demak', tipe: 'kabupaten', dapil: 'Dapil I', penduduk: 1191284 },
  { id: 'wil-klaten', nama: 'Kabupaten Klaten', tipe: 'kabupaten', dapil: 'Dapil VII', penduduk: 1170686 },
  { id: 'wil-pati', nama: 'Kabupaten Pati', tipe: 'kabupaten', dapil: 'Dapil IV', penduduk: 1246603 },
  { id: 'wil-wonogiri', nama: 'Kabupaten Wonogiri', tipe: 'kabupaten', dapil: 'Dapil VI', penduduk: 949515 },
  { id: 'wil-magelang-kab', nama: 'Kabupaten Magelang', tipe: 'kabupaten', dapil: 'Dapil VIII', penduduk: 1289104 },
  { id: 'wil-tegal-kab', nama: 'Kabupaten Tegal', tipe: 'kabupaten', dapil: 'Dapil II', penduduk: 1580996 },
  { id: 'wil-kendal', nama: 'Kabupaten Kendal', tipe: 'kabupaten', dapil: 'Dapil III', penduduk: 995766 },
  { id: 'wil-boyolali', nama: 'Kabupaten Boyolali', tipe: 'kabupaten', dapil: 'Dapil VII', penduduk: 984025 },
  { id: 'wil-pemalang', nama: 'Kabupaten Pemalang', tipe: 'kabupaten', dapil: 'Dapil II', penduduk: 1348464 },
];

export const wilayahById = (id: string) => wilayahList.find((w) => w.id === id);

export const dapilOptions = Array.from(new Set(wilayahList.map((w) => w.dapil))).sort();
