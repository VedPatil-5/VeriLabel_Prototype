import React, { useState } from 'react';
import { Header } from './components/Header';
import { BottomNav, TabId } from './components/BottomNav';
import { OverviewTab } from './components/OverviewTab';
import { ScannerTab } from './components/ScannerTab';
import { TeamTab } from './components/TeamTab';
import { ChatbotFab } from './components/ChatbotFab';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabId>('home');

  return (
    <div className="min-h-screen flex flex-col font-sans bg-[#faf8ff] text-[#131b2e] antialiased">
      {/* Fixed Top Header */}
      <Header onOpenProfile={() => setActiveTab('team')} />

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-[1280px] mx-auto px-4 pt-20 pb-24">
        {activeTab === 'home' && (
          <OverviewTab
            onNavigateToScanner={() => setActiveTab('scanner')}
            onNavigateToTeam={() => setActiveTab('team')}
          />
        )}
        {activeTab === 'scanner' && <ScannerTab />}
        {activeTab === 'team' && (
          <TeamTab
            onNavigateToHome={() => setActiveTab('home')}
            onNavigateToScanner={() => setActiveTab('scanner')}
          />
        )}
      </main>

      {/* Fixed Floating Action Button (FAB) for VeriLabel AI Assistant present on EVERY screen */}
      <ChatbotFab />

      {/* Fixed Bottom Navigation (Home / Scanner / Team) */}
      <BottomNav activeTab={activeTab} onSelectTab={setActiveTab} />
    </div>
  );
};
