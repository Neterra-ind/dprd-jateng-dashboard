import { NavLink, Outlet } from 'react-router-dom';
import { Crown } from 'lucide-react';
import GlobalFilterBar from '../../components/GlobalFilterBar';
import { DemoDataTag } from '../../components/Badges';
import { Avatar } from '../../components/ui';
import { usePimpinanLeader } from '../../lib/usePimpinanLeader';
import { fraksiById } from '../../data/fraksi';

const tabs = [
  { to: '/pimpinan/overview', label: 'Executive Overview' },
  { to: '/pimpinan/kinerja', label: 'Kinerja Pimpinan' },
  { to: '/pimpinan/personal-issues', label: 'Personal Issues' },
  { to: '/pimpinan/media-exposure', label: 'Media Exposure' },
  { to: '/pimpinan/digital-assets', label: 'Digital Assets' },
  { to: '/pimpinan/digital-performance', label: 'Digital Performance' },
  { to: '/pimpinan/public-engagement', label: 'Public Engagement' },
  { to: '/pimpinan/strategic-attention', label: 'Strategic Attention' },
];

export default function PimpinanLayout() {
  const { leader, leaderId, setLeaderId, leadershipList } = usePimpinanLeader();

  return (
    <div>
      <div
        className="mb-5 rounded-xl border p-5"
        style={{
          background: 'linear-gradient(135deg, var(--color-navy-950), var(--color-navy-800))',
          borderColor: 'var(--color-navy-700)',
        }}
      >
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-accent">
              <Crown size={16} />
              <span className="text-[11px] font-semibold uppercase tracking-wider">Executive Intelligence Center</span>
            </div>
            <h1 className="mt-1.5 text-[21px] font-semibold tracking-tight text-white">Pimpinan DPRD Jawa Tengah</h1>
            <p className="mt-1 text-[13px] text-white/60">Executive Performance & Personal Digital Asset Intelligence</p>
          </div>
          <DemoDataTag />
        </div>

        <div className="mt-4 flex gap-2 overflow-x-auto scrollbar-thin">
          {leadershipList.map((l) => (
            <button
              key={l.id}
              onClick={() => setLeaderId(l.id)}
              className={`flex shrink-0 items-center gap-2.5 rounded-md py-1.5 pl-1.5 pr-3 text-left text-[12.5px] font-medium transition-colors ${
                l.id === leaderId ? 'bg-accent text-navy-950' : 'bg-white/8 text-white/70 hover:bg-white/15'
              }`}
              style={l.id === leaderId ? { color: 'var(--color-navy-950)' } : undefined}
            >
              <Avatar name={l.nama} src={l.foto} size={36} />
              <span className="whitespace-nowrap">
                <span className="block font-semibold">{l.jabatan}</span>
                <span className="block text-[11px] opacity-80">{l.nama.split(',')[0]}</span>
              </span>
            </button>
          ))}
        </div>

        <p className="mt-3 text-[12px] text-white/50">
          {leader.nama} · {fraksiById(leader.fraksiId)?.nama} ·{' '}
          {leader.jabatan === 'Ketua DPRD' ? leader.jabatan : `${leader.jabatan} DPRD`} Provinsi Jawa Tengah
        </p>
      </div>

      <div className="mb-4 flex gap-1 overflow-x-auto rounded-lg border border-border bg-surface-alt/60 p-1.5 scrollbar-thin">
        {tabs.map((t) => (
          <NavLink
            key={t.to}
            to={`${t.to}?leader=${leaderId}`}
            className={({ isActive }) =>
              `whitespace-nowrap rounded-md px-3 py-1.5 text-[12.5px] font-medium transition-colors ${
                isActive ? 'bg-navy-900 text-white' : 'text-ink-soft hover:bg-surface'
              }`
            }
            style={({ isActive }) => (isActive ? { background: 'var(--color-navy-900)' } : undefined)}
          >
            {t.label}
          </NavLink>
        ))}
      </div>

      <GlobalFilterBar show={['periode', 'wilayah', 'isu', 'media', 'platform']} />

      <Outlet />
    </div>
  );
}
