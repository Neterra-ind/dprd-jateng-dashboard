import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader, SectionCard, EmptyState } from '../components/ui';
import GlobalFilterBar from '../components/GlobalFilterBar';
import { useFilters } from '../context/FilterContext';
import { isuWilayahList } from '../data';
import { wilayahById } from '../data/wilayah';
import { opdById } from '../data/opd';
import { komisiById } from '../data/komisi';
import { anggotaById } from '../data/anggota';
import { filterIsu } from '../lib/filters';
import { SentimentBadge, StatusBadge, TrendTag } from '../components/Badges';
import OPDProfileDrawer from '../components/OPDProfileDrawer';
import { useState } from 'react';

export default function IsuWilayah() {
  const { filters } = useFilters();
  const navigate = useNavigate();
  const [selectedOpdId, setSelectedOpdId] = useState<string | null>(null);
  const filtered = useMemo(() => filterIsu(isuWilayahList, filters).sort((a, b) => b.volume - a.volume), [filters]);

  return (
    <div>
      <PageHeader
        title="Isu Wilayah"
        breadcrumb="Monitoring Wilayah"
        description="Memantau seluruh isu yang berkembang di wilayah, termasuk isu yang menjadi kewenangan Pemerintah Daerah — bukan hanya pemberitaan tentang DPRD."
      />

      <GlobalFilterBar show={['periode', 'wilayah', 'komisi', 'urusan', 'opd', 'sentiment']} />

      <SectionCard>
        {filtered.length === 0 ? (
          <EmptyState message="Tidak ada isu yang sesuai dengan filter saat ini." />
        ) : (
          <div className="overflow-x-auto -mx-4 lg:-mx-5">
            <table className="w-full min-w-[1100px] border-collapse text-[12.5px]">
              <thead>
                <tr className="border-b border-border text-left text-[11px] uppercase tracking-wide text-ink-faint">
                  <th className="px-4 py-2 font-medium lg:px-5">Isu</th>
                  <th className="px-3 py-2 font-medium">Volume</th>
                  <th className="px-3 py-2 font-medium">Trend</th>
                  <th className="px-3 py-2 font-medium">Sentimen</th>
                  <th className="px-3 py-2 font-medium">Lokasi</th>
                  <th className="px-3 py-2 font-medium">OPD</th>
                  <th className="px-3 py-2 font-medium">Komisi</th>
                  <th className="px-3 py-2 font-medium">Anggota Terkait</th>
                  <th className="px-3 py-2 font-medium">Respons Pemda</th>
                  <th className="px-3 py-2 font-medium">Respons DPRD</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((isu) => (
                  <tr
                    key={isu.id}
                    onClick={() => navigate(`/isu-wilayah/${isu.id}`)}
                    className="cursor-pointer border-b border-border last:border-0 hover:bg-surface-alt"
                  >
                    <td className="px-4 py-2.5 lg:px-5">
                      <p className="font-semibold text-ink">{isu.nama}</p>
                      <div className="mt-1 flex items-center gap-1.5">
                        <span className="text-[11px] text-ink-faint">{isu.kategori}</span>
                      </div>
                    </td>
                    <td className="px-3 py-2.5 font-medium text-ink">{isu.volume.toLocaleString('id-ID')}</td>
                    <td className="px-3 py-2.5"><TrendTag value={isu.trend} /></td>
                    <td className="px-3 py-2.5"><SentimentBadge sentiment={isu.sentiment} /></td>
                    <td className="px-3 py-2.5 text-ink-soft">{isu.wilayahIds.map((w) => wilayahById(w)?.nama).join(', ')}</td>
                    <td className="px-3 py-2.5 text-ink-soft">
                      {isu.opdIds.map((o) => (
                        <button
                          key={o}
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedOpdId(o);
                          }}
                          className="mr-1 rounded px-1 hover:bg-ink hover:text-white"
                        >
                          {opdById(o)?.singkatan}
                        </button>
                      ))}
                    </td>
                    <td className="px-3 py-2.5 text-ink-soft">{isu.komisiIds.map((k) => komisiById(k)?.kode).join(', ')}</td>
                    <td className="px-3 py-2.5 text-ink-soft">
                      {isu.anggotaIds.slice(0, 1).map((a) => anggotaById(a)?.nama.split(',')[0]).join(', ')}
                      {isu.anggotaIds.length > 1 ? ` +${isu.anggotaIds.length - 1}` : ''}
                    </td>
                    <td className="px-3 py-2.5"><StatusBadge status={isu.statusResponsPemda} /></td>
                    <td className="px-3 py-2.5"><StatusBadge status={isu.statusResponsDprd} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </SectionCard>

      <OPDProfileDrawer opdId={selectedOpdId} onClose={() => setSelectedOpdId(null)} />
    </div>
  );
}
