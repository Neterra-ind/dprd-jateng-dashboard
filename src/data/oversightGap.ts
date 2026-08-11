import type { OversightGapEntry } from './types';
import { isuWilayahList } from './isuWilayah';

function eksposLevel(volume: number): 'low' | 'medium' | 'high' {
  if (volume >= 600) return 'high';
  if (volume >= 250) return 'medium';
  return 'low';
}

export const oversightGapList: OversightGapEntry[] = isuWilayahList.map((isu) => {
  const ekspos = eksposLevel(isu.volume);
  let status: OversightGapEntry['status'] = 'monitoring';
  let catatan = 'Tingkat perhatian saat ini proporsional dengan eksposur isu.';

  if (isu.statusResponsDprd === 'belum' && (ekspos === 'high' || ekspos === 'medium')) {
    status = 'oversight_gap';
    catatan =
      isu.statusResponsPemda === 'ada'
        ? 'Pemda telah merespons, namun DPRD belum menunjukkan sikap atau rekomendasi resmi atas isu ini.'
        : 'Baik Pemda maupun DPRD belum menunjukkan respons resmi meski eksposur media tergolong signifikan.';
  } else if (isu.statusResponsDprd === 'ada' || isu.statusResponsDprd === 'sebagian') {
    status = 'aligned';
    catatan = 'DPRD telah menunjukkan bentuk respons melalui rapat, rekomendasi, atau pernyataan resmi.';
  }

  return {
    id: `gap-${isu.id}`,
    isuId: isu.id,
    ekspos,
    responsPemda: isu.statusResponsPemda,
    responsDprd: isu.statusResponsDprd,
    status,
    catatan,
  };
});

export const oversightGapByIsuId = (isuId: string) => oversightGapList.find((g) => g.isuId === isuId);
