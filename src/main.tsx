import { useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Header } from '@/components/Header';
import { Home } from '@/components/Home';
import { DrawingBoard } from '@/components/DrawingBoard';
import { BattleArena } from '@/components/BattleArena';
import { GameCreator } from '@/components/GameCreator';
import { ScriptTool } from '@/components/ScriptTool';
import { Profile } from '@/components/Profile';
import '@/index.css';

function App() {
  const [activeTab, setActiveTab] = useState('home');

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return <Home onNavigate={setActiveTab} />;
      case 'draw':
        return <DrawingBoard />;
      case 'battle':
        return <BattleArena />;
      case 'game':
        return <GameCreator />;
      case 'script':
        return <ScriptTool />;
      case 'profile':
        return <Profile />;
      default:
        return <Home onNavigate={setActiveTab} />;
    }
  };

  return (
    <div className="min-h-screen">
      <Header activeTab={activeTab} onTabChange={setActiveTab} />
      <main>
        {renderContent()}
      </main>
    </div>
  );
}

createRoot(document.getElementById('root')!).render(<App />);