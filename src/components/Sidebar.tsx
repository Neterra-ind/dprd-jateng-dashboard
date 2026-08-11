import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  MapPinned,
  Landmark,
  Gavel,
  UserRound,
  Newspaper,
  Share2,
  ShieldAlert,
  BrainCircuit,
  Crown,
} from 'lucide-react';
import logoJateng from '../assets/brand/logo.png';

const navItemsTop = [
  { to: '/', label: 'Executive Dashboard', icon: LayoutDashboard, end: true },
];

const navItemsRest = [
  { to: '/isu-wilayah', label: 'Isu Wilayah', icon: MapPinned },
  { to: '/isu-komisi', label: 'Isu Komisi', icon: Landmark },
  { to: '/kinerja', label: 'Kinerja DPRD', icon: Gavel },
  { to: '/personal', label: 'Personal DPRD', icon: UserRound },
  { to: '/media-monitoring', label: 'Media Monitoring', icon: Newspaper },
  { to: '/media-sosial', label: 'Media Sosial', icon: Share2 },
  { to: '/isu-negatif', label: 'Isu Negatif', icon: ShieldAlert },
  { to: '/intelligence', label: 'Intelligence', icon: BrainCircuit },
];

export default function Sidebar() {
  return (
    <aside className="hidden md:flex w-52 lg:w-60 shrink-0 flex-col bg-navy-950 text-white h-screen sticky top-0" style={{ background: 'var(--color-navy-950)' }}>
      <div className="flex items-center gap-2.5 px-4 h-16 border-b border-white/10">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-white p-1">
          <img src={logoJateng} alt="Logo Jawa Tengah" className="h-full w-full object-contain" />
        </div>
        <div className="leading-tight">
          <p className="text-[13px] font-semibold tracking-tight">DPRD Jawa Tengah</p>
          <p className="text-[10.5px] text-white/50">Government & Political</p>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto py-3 px-2.5 scrollbar-thin">
        <ul className="space-y-0.5">
          {navItemsTop.map((item) => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `flex items-center gap-2.5 rounded-md px-3 py-2 text-[13px] font-medium transition-colors ${
                    isActive
                      ? 'bg-white/10 text-white'
                      : 'text-white/60 hover:bg-white/5 hover:text-white/90'
                  }`
                }
              >
                <item.icon size={16} strokeWidth={2} />
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>

        <ul className="my-1.5 space-y-0.5">
          <li>
            <NavLink
              to="/pimpinan"
              className={({ isActive }) =>
                `flex items-center gap-2.5 rounded-md px-3 py-2 text-[13px] font-semibold transition-colors ${
                  isActive ? 'bg-accent/10 text-accent' : 'text-white/70 hover:bg-white/5 hover:text-white/90'
                }`
              }
            >
              <Crown size={16} strokeWidth={2} className="text-accent" />
              Pimpinan DPRD
            </NavLink>
          </li>
        </ul>

        <ul className="space-y-0.5">
          {navItemsRest.map((item) => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center gap-2.5 rounded-md px-3 py-2 text-[13px] font-medium transition-colors ${
                    isActive
                      ? 'bg-white/10 text-white'
                      : 'text-white/60 hover:bg-white/5 hover:text-white/90'
                  }`
                }
              >
                <item.icon size={16} strokeWidth={2} />
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <div className="px-4 py-3 border-t border-white/10">
        <p className="text-[10px] text-white/40 leading-relaxed">
          DPRD Provinsi Jawa Tengah<br />Prototype — Demo Data
        </p>
      </div>
    </aside>
  );
}
