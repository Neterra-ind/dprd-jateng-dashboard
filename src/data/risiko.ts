import type { NegativeIssueRisk, RiskLevel, RiskQuadrant } from './types';
import { isuWilayahList } from './isuWilayah';

const maxVolume = Math.max(...isuWilayahList.map((i) => i.volume));

const urgencyScore: Record<string, number> = { low: 25, medium: 50, high: 75, critical: 95 };

function computeQuadrant(exposure: number, impact: number): RiskQuadrant {
  const highExposure = exposure >= 50;
  const highImpact = impact >= 50;
  if (highExposure && highImpact) return 'strategic_issue';
  if (highExposure && !highImpact) return 'attention';
  if (!highExposure && highImpact) return 'manage';
  return 'monitor';
}

function computeLevel(score: number): RiskLevel {
  if (score >= 80) return 'critical';
  if (score >= 60) return 'high';
  if (score >= 40) return 'medium';
  return 'low';
}

const rekomendasiMap: Record<RiskQuadrant, string> = {
  strategic_issue: 'Perlu perhatian dan respons resmi DPRD segera; risiko reputasi dan eksposur media tinggi secara bersamaan.',
  attention: 'Eksposur media tinggi meski dampak kebijakan relatif terbatas; perlu klarifikasi publik untuk mencegah eskalasi persepsi.',
  manage: 'Dampak berpotensi signifikan meski belum ramai diberitakan; perlu langkah mitigasi preventif sebelum menjadi sorotan luas.',
  monitor: 'Eksposur dan dampak masih terkendali; cukup dipantau secara berkala tanpa tindakan mendesak.',
};

export const risikoList: NegativeIssueRisk[] = isuWilayahList
  .filter((isu) => isu.sentimentBreakdown.negative >= 40 || isu.urgency === 'high' || isu.urgency === 'critical')
  .map((isu) => {
    const mediaExposure = Math.round((isu.volume / maxVolume) * 100);
    const impactBase = urgencyScore[isu.urgency];
    const negWeight = isu.sentimentBreakdown.negative;
    const potentialImpact = Math.min(100, Math.round(impactBase * 0.55 + negWeight * 0.35 + isu.dampak.length * 3));
    const quadrant = computeQuadrant(mediaExposure, potentialImpact);
    const trendComponent = Math.max(0, Math.min(100, 50 + isu.trend));
    const analyticalRiskScore = Math.round(
      mediaExposure * 0.3 + potentialImpact * 0.35 + negWeight * 0.2 + trendComponent * 0.15
    );
    const level = computeLevel(analyticalRiskScore);
    const politicalRelevance: 'low' | 'medium' | 'high' = isu.strategic || isu.komisiIds.length > 1 ? 'high' : isu.emerging ? 'medium' : 'low';

    return {
      id: `risk-${isu.id}`,
      isuId: isu.id,
      level,
      mediaExposure,
      potentialImpact,
      quadrant,
      analyticalRiskScore,
      indikatorVolume: isu.volume,
      indikatorSentiment: negWeight,
      indikatorEngagement: Math.round(mediaExposure * 0.8 + negWeight * 0.2),
      indikatorTrend: isu.trend,
      politicalRelevance,
      rekomendasi: rekomendasiMap[quadrant],
    };
  })
  .sort((a, b) => b.analyticalRiskScore - a.analyticalRiskScore);

export const risikoById = (id: string) => risikoList.find((r) => r.id === id);
export const risikoByIsuId = (isuId: string) => risikoList.find((r) => r.isuId === isuId);
