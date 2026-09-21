import React, { useEffect, useState } from 'react';
import { Header } from './components/Header';
import { BottomNav, TabId } from './components/BottomNav';
import { OverviewTab } from './components/OverviewTab';
import { ScannerTab } from './components/ScannerTab';
import { TeamTab } from './components/TeamTab';
import { ChatbotFab } from './components/ChatbotFab';
import { RoleSelectionPage } from './pages/RoleSelectionPage';
import { OfficerAuthPage } from './pages/OfficerAuthPage';
import { OfficerDashboardPage } from './pages/OfficerDashboardPage';
import { ThemeProvider } from './context/ThemeContext';
import { I18nProvider } from './i18n';

const routePath = () => window.location.pathname.replace(/\/+$/, '') || '/';

export const App: React.FC = () => {
  const [path, setPath] = useState(routePath);
  const [activeTab, setActiveTab] = useState<TabId>(() => window.location.hash === '#team' ? 'team' : window.location.hash === '#scanner' ? 'scanner' : 'home');
  const navigate = (nextPath: string) => { window.history.pushState({}, '', nextPath); setPath(nextPath); window.scrollTo({ top: 0, behavior: 'smooth' }); };
  useEffect(() => { const onPop = () => setPath(routePath()); window.addEventListener('popstate', onPop); return () => window.removeEventListener('popstate', onPop); }, []);
  const customer = path === '/customer' || path.startsWith('/customer/');
  const officer = path === '/officer/dashboard' || path === '/officer/scan';
  const protectedOfficer = officer && sessionStorage.getItem('verilabel:officer') !== 'true';
  if (path === '/') return <ThemeProvider><I18nProvider><RoleSelectionPage navigate={navigate} /></I18nProvider></ThemeProvider>;
  if (path === '/officer' || protectedOfficer) return <ThemeProvider><I18nProvider><OfficerAuthPage navigate={navigate} /></I18nProvider></ThemeProvider>;
  if (path === '/officer/dashboard') return <ThemeProvider><I18nProvider><OfficerDashboardPage navigate={navigate} /></I18nProvider></ThemeProvider>;
  if (path === '/officer/scan') return <ThemeProvider><I18nProvider><CustomerShell activeTab="scanner" setActiveTab={setActiveTab} navigate={navigate} officerMode /></I18nProvider></ThemeProvider>;
  if (customer) return <ThemeProvider><I18nProvider><CustomerShell activeTab={activeTab} setActiveTab={setActiveTab} navigate={navigate} /></I18nProvider></ThemeProvider>;
  return <ThemeProvider><I18nProvider><RoleSelectionPage navigate={navigate} /></I18nProvider></ThemeProvider>;
};

const CustomerShell: React.FC<{ activeTab: TabId; setActiveTab: (tab: TabId) => void; navigate: (path: string) => void; officerMode?: boolean }> = ({ activeTab, setActiveTab, navigate, officerMode = false }) => {
  const goTab = (tab: TabId) => { setActiveTab(tab); window.history.replaceState({}, '', `/customer#${tab}`); };
  return <div className="min-h-screen flex flex-col font-sans bg-[var(--surface)] text-[var(--text)] antialiased"><Header onOpenProfile={() => goTab('team')} onBack={() => navigate(officerMode ? '/officer/dashboard' : '/')} /><main className="flex-1 w-full max-w-[1280px] mx-auto px-4 pt-20 pb-24">{activeTab === 'home' && <OverviewTab onNavigateToScanner={() => goTab('scanner')} onNavigateToTeam={() => goTab('team')} />}{activeTab === 'scanner' && <ScannerTab />}{activeTab === 'team' && <TeamTab onNavigateToHome={() => goTab('home')} onNavigateToScanner={() => goTab('scanner')} />}</main><ChatbotFab officerMode={officerMode} /><BottomNav activeTab={activeTab} onSelectTab={goTab} /></div>;
};
