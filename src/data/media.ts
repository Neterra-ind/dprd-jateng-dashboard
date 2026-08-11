import type { Media } from './types';

export const mediaList: Media[] = [
  { id: 'media-lensa-jateng', nama: 'Lensa Jawa Tengah', tipe: 'online_lokal', reach: 480000, credibility: 4 },
  { id: 'media-warta-semarang', nama: 'Warta Semarang', tipe: 'online_lokal', reach: 320000, credibility: 4 },
  { id: 'media-kabar-merdeka', nama: 'Kabar Merdeka Jateng', tipe: 'online_lokal', reach: 610000, credibility: 4 },
  { id: 'media-radar-jateng', nama: 'Radar Jateng Online', tipe: 'online_lokal', reach: 275000, credibility: 3 },
  { id: 'media-suara-rakyat', nama: 'Suara Rakyat Jateng', tipe: 'online_lokal', reach: 198000, credibility: 3 },
  { id: 'media-portal-mataram', nama: 'Portal Pantura News', tipe: 'online_lokal', reach: 156000, credibility: 3 },
  { id: 'media-nusantara-today', nama: 'Nusantara Today', tipe: 'online_nasional', reach: 2100000, credibility: 5 },
  { id: 'media-cakrawala-nasional', nama: 'Cakrawala Nasional', tipe: 'online_nasional', reach: 1850000, credibility: 5 },
  { id: 'media-berita-utama', nama: 'Berita Utama Indonesia', tipe: 'online_nasional', reach: 1420000, credibility: 4 },
  { id: 'media-jateng-tv', nama: 'Jateng TV', tipe: 'tv', reach: 890000, credibility: 4 },
  { id: 'media-swara-fm', nama: 'Swara FM Semarang', tipe: 'radio', reach: 145000, credibility: 3 },
  { id: 'media-koran-jawa', nama: 'Koran Jawa Pos Regional', tipe: 'cetak', reach: 210000, credibility: 4 },
];

export const mediaById = (id: string) => mediaList.find((m) => m.id === id);
