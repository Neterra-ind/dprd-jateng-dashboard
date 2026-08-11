import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader, SectionCard, EmptyState } from '../components/ui';
import GlobalFilterBar from '../components/GlobalFilterBar';
import { useFilters } from '../context/FilterContext';
import { risikoList, risikoById } from '../data/risiko';
import { isuById } from '../data/isuWilayah';
import { komisiById } from '../data/komisi';
import { wilayahById } from '../data/wilayah';
import { filterIsu } from '../lib/filters';
import { isuWilayahList } from '../data/isuWilayah';
import { RiskLevelBadge, TrendTag } from '../components/Badges';
import RiskMatrix from '../components/charts/RiskMatrix';
import Drawer from '../components/Drawer';
import type { RiskLevel } from '../data';

const levelOrder: RiskLevel[] = ['critical', 'high', 'medium', 'low'];
const levelLabel: Record<RiskLevel, string> = { critical: 'Critical', high: 'High', medium: 'Medium', low: 'Low' };

const quadrantLabel: Record<string, string> = {
  strategic_issue: 'Strategic Issue',
  attention: 'Attention',
  manage: 'Manage',
  monitor: 'Monitor',
};

export default function IsuNegatif() {
  const { filters } = useFilters();
  const navigate = useNavigate();
  const [selectedRiskId, setSelectedRiskId] = useState<string | null>(null);

  const allowedIsuIds = useMemo(() => new Set(filterIsu(isuWilayahList, filters).map((i) => i.id)), [filters]);
  const filteredRisk = useMemo(() => risikoList.filter((r) => allowedIsuIds.has(r.isuId)), [allowedIsuIds]);

  const byLevel = useMemo(() => {
    const map = new Map<RiskLevel, number>();
    for (const l of levelOrder) map.set(l, 0);
    for (const r of filteredRisk) map.set(r.level, (map.get(r.level) ?? 0) + 1);
    return map;
  }, [filteredRisk]);

  const selectedRisk = selectedRiskId ? risikoById(selectedRiskId) : null;
  const selectedIsu = selectedRisk ? isuById(selectedRisk.isuId) : null;

  return (
    <div>
      <PageHeader
        title="Isu Negatif & Early Warning"
        breadcrumb="Risk Intelligence"
        description="Klasifikasi risiko reputasi berbasis eksposur media dan potensi dampak kebijakan. Analytical Risk Score bersifat ilustratif, bukan penilaian resmi."
      />

      <GlobalFilterBar show={['periode', 'wilayah', 'komisi']} />

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4 mb-5">
        {levelOrder.map((l) => (
          <div key={l} className="rounded-lg border border-border bg-surface p-4">
            <RiskLevelBadge level={l} />
            <p className="mt-2 text-[24px] font-semibold text-ink">{byLevel.get(l)}</p>
            <p className="text-[11px] text-ink-faint">isu terklasifikasi {levelLabel[l].toLowerCase()}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 mb-4">
        <SectionCard
          title="Risk Matrix"
          description="Sumbu X: Eksposur Media · Sumbu Y: Dampak Potensial. Klik titik untuk melihat Risk Detail."
          className="lg:col-span-2"
        >
          {filteredRisk.length === 0 ? (
            <EmptyState message="Tidak ada isu negatif pada filter saat ini." />
          ) : (
            <RiskMatrix data={filteredRisk} onSelect={(isuId) => setSelectedRiskId(`risk-${isuId}`)} />
          )}
        </SectionCard>

        <SectionCard title="Kuadran Risiko" description="Panduan interpretasi">
          <div className="space-y-3 text-[12.5px]">
            <div>
              <p className="font-semibold text-ink">Strategic Issue</p>
              <p className="text-ink-soft">Eksposur & dampak tinggi — prioritas perhatian tertinggi.</p>
            </div>
            <div>
              <p className="font-semibold text-ink">Attention</p>
              <p className="text-ink-soft">Eksposur tinggi, dampak relatif terbatas — perlu klarifikasi publik.</p>
            </div>
            <div>
              <p className="font-semibold text-ink">Manage</p>
              <p className="text-ink-soft">Dampak berpotensi besar meski belum ramai — mitigasi preventif.</p>
            </div>
            <div>
              <p className="font-semibold text-ink">Monitor</p>
              <p className="text-ink-soft">Terkendali — cukup dipantau berkala.</p>
            </div>
          </div>
        </SectionCard>
      </div>

      <SectionCard title="Daftar Isu Negatif" description="Diurutkan berdasarkan Analytical Risk Score">
        {filteredRisk.length === 0 ? (
          <EmptyState message="Tidak ada isu negatif pada filter saat ini." />
        ) : (
          <div className="overflow-x-auto -mx-4 lg:-mx-5">
            <table className="w-full min-w-[900px] text-[12.5px]">
              <thead>
                <tr className="border-b border-border text-left text-[11px] uppercase tracking-wide text-ink-faint">
                  <th className="px-4 py-2 font-medium lg:px-5">Isu</th>
                  <th className="px-3 py-2 font-medium">Level</th>
                  <th className="px-3 py-2 font-medium">Kuadran</th>
                  <th className="px-3 py-2 font-medium">Trend</th>
                  <th className="px-3 py-2 font-medium">Relevansi Politik</th>
                  <th className="px-3 py-2 font-medium">Analytical Risk Score</th>
                </tr>
              </thead>
              <tbody>
                {filteredRisk.map((r) => {
                  const isu = isuById(r.isuId);
                  return (
                    <tr key={r.id} onClick={() => setSelectedRiskId(r.id)} className="cursor-pointer border-b border-border last:border-0 hover:bg-surface-alt">
                      <td className="px-4 py-2.5 font-medium text-ink lg:px-5">{isu?.nama}</td>
                      <td className="px-3 py-2.5"><RiskLevelBadge level={r.level} /></td>
                      <td className="px-3 py-2.5 text-ink-soft">{quadrantLabel[r.quadrant]}</td>
                      <td className="px-3 py-2.5"><TrendTag value={r.indikatorTrend} /></td>
                      <td className="px-3 py-2.5 text-ink-soft capitalize">{r.politicalRelevance}</td>
                      <td className="px-3 py-2.5 font-semibold text-ink">{r.analyticalRiskScore}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </SectionCard>

      <Drawer
        open={!!selectedRisk}
        onClose={() => setSelectedRiskId(null)}
        title={selectedIsu?.nama ?? ''}
        eyebrow="Risk Detail — Analytical Score Prototype"
      >
        {selectedRisk && selectedIsu && (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <RiskLevelBadge level={selectedRisk.level} />
              <span className="rounded-full bg-surface-alt px-2.5 py-0.5 text-[11px] font-medium text-ink-soft">
                {quadrantLabel[selectedRisk.quadrant]}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-md border border-border p-3">
                <p className="text-[11px] uppercase text-ink-faint">Eksposur Media</p>
                <p className="text-[18px] font-semibold text-ink">{selectedRisk.mediaExposure}/100</p>
              </div>
              <div className="rounded-md border border-border p-3">
                <p className="text-[11px] uppercase text-ink-faint">Dampak Potensial</p>
                <p className="text-[18px] font-semibold text-ink">{selectedRisk.potentialImpact}/100</p>
              </div>
              <div className="rounded-md border border-border p-3">
                <p className="text-[11px] uppercase text-ink-faint">Volume Pemberitaan</p>
                <p className="text-[18px] font-semibold text-ink">{selectedRisk.indikatorVolume.toLocaleString('id-ID')}</p>
              </div>
              <div className="rounded-md border border-border p-3">
                <p className="text-[11px] uppercase text-ink-faint">Sentimen Negatif</p>
                <p className="text-[18px] font-semibold text-ink">{selectedRisk.indikatorSentiment}%</p>
              </div>
            </div>

            <div>
              <p className="text-[12px] font-semibold uppercase text-ink-faint mb-1">Analytical Risk Score — Prototype</p>
              <p className="text-[28px] font-semibold text-ink">{selectedRisk.analyticalRiskScore}<span className="text-[14px] text-ink-faint">/100</span></p>
            </div>

            <div>
              <p className="text-[12px] font-semibold uppercase text-ink-faint mb-1">Rekomendasi</p>
              <p className="text-[13px] text-ink-soft">{selectedRisk.rekomendasi}</p>
            </div>

            <div>
              <p className="text-[12px] font-semibold uppercase text-ink-faint mb-1">Lokasi</p>
              <p className="text-[13px] text-ink-soft">{selectedIsu.wilayahIds.map((w) => wilayahById(w)?.nama).join(', ')}</p>
            </div>

            <div>
              <p className="text-[12px] font-semibold uppercase text-ink-faint mb-1">Komisi Terkait</p>
              <p className="text-[13px] text-ink-soft">{selectedIsu.komisiIds.map((k) => komisiById(k)?.nama).join(', ')}</p>
            </div>

            <button
              onClick={() => navigate(`/isu-wilayah/${selectedIsu.id}`)}
              className="w-full rounded-md bg-brand py-2 text-[13px] font-medium text-white hover:bg-brand-dark"
            >
              Buka Halaman Detail Isu
            </button>
          </div>
        )}
      </Drawer>
    </div>
  );
}
