import { NavLink, Outlet } from 'react-router-dom';
import { Home, QrCode, Zap, BarChart2, User, GraduationCap } from 'lucide-react';

const tabs = [
  { to: '/mobile', icon: Home, label: 'Bosh sahifa', end: true },
  { to: '/mobile/scanner', icon: QrCode, label: 'QR Scanner', end: false },
  { to: '/mobile/remote', icon: Zap, label: 'Pult', end: false },
  { to: '/mobile/grades', icon: BarChart2, label: 'Baholar', end: false },
  { to: '/mobile/profile', icon: User, label: 'Profil', end: false },
];

export default function MobileLayout() {
  return (
    <div className="min-h-screen bg-zinc-100 max-w-md mx-auto relative">
      {/* Top Header */}
      <header className="fixed top-0 left-0 right-0 z-50 h-14 bg-zinc-900 text-white flex items-center justify-between px-4 max-w-md mx-auto">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
            <GraduationCap className="w-5 h-5 text-white" />
          </div>
          <span className="text-base font-semibold">Murabbiyona</span>
        </div>
        <span className="text-xs text-zinc-400 bg-zinc-800 px-2 py-1 rounded-lg">
          Ustoz App
        </span>
      </header>

      {/* Content Area */}
      <main className="px-4 py-4 pt-[72px] pb-24">
        <Outlet />
      </main>

      {/* Bottom Tab Bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-zinc-200 max-w-md mx-auto safe-area-bottom">
        <div className="flex items-center justify-around h-16">
          {tabs.map(tab => {
            const Icon = tab.icon;
            return (
              <NavLink
                key={tab.to}
                to={tab.to}
                end={tab.end}
                className={({ isActive }) =>
                  `flex flex-col items-center gap-0.5 px-2 py-1.5 rounded-xl transition-all min-w-[56px] ${
                    isActive ? 'text-emerald-600' : 'text-zinc-400 active:text-zinc-600'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <div className={`p-1 rounded-lg ${isActive ? 'bg-emerald-50' : ''}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-medium">{tab.label}</span>
                  </>
                )}
              </NavLink>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
