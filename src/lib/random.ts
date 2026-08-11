export function mulberry32(seed: number) {
  let a = seed;
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function seededRng(seed = 42) {
  const rand = mulberry32(seed);
  return {
    next: () => rand(),
    int: (min: number, max: number) => Math.floor(rand() * (max - min + 1)) + min,
    pick: <T,>(arr: T[]): T => arr[Math.floor(rand() * arr.length)],
    pickMultiple: <T,>(arr: T[], count: number): T[] => {
      const shuffled = [...arr].sort(() => rand() - 0.5);
      return shuffled.slice(0, count);
    },
    bool: (probability = 0.5) => rand() < probability,
  };
}

export function daysAgo(base: string, days: number): string {
  const d = new Date(base);
  d.setDate(d.getDate() - days);
  return d.toISOString().slice(0, 10);
}
