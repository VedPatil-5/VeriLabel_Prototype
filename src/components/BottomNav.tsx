import React from 'react';
import { Home, Scan, Users } from 'lucide-react';
import { useI18n } from '../i18n';

export type TabId = 'home' | 'scanner' | 'team';

interface BottomNavProps {
  activeTab: TabId;
  onSelectTab: (tab: TabId) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onSelectTab }) => {
  const { t } = useI18n();
  const tabs: { id: TabId; label: string; icon: React.ReactNode }[] = [
    { id: 'home', label: t('home'), icon: <Home className="w-5 h-5" /> },
    { id: 'scanner', label: t('scanner'), icon: <Scan className="w-5 h-5" /> },
    { id: 'team', label: t('team'), icon: <Users className="w-5 h-5" /> }
  ];

  return (
    <nav className="fixed bottom-0 inset-x-0 z-40 pb-safe bg-[var(--surface)]/90 backdrop-blur-xl shadow-[0_-2px_12px_var(--shadow)] border-t border-[var(--border)]/40 font-sans">
      <div className="flex justify-around items-center h-16 max-w-md mx-auto px-4">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onSelectTab(tab.id)}
              className={`flex flex-col items-center justify-center gap-1 min-w-[64px] min-h-[44px] transition-colors cursor-pointer ${
                isActive
                  ? 'text-[var(--primary)] font-semibold'
                  : 'text-[var(--muted)] hover:text-[var(--text)]'
              }`}
            >
              {tab.icon}
              <span className="text-[11px] leading-none">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
