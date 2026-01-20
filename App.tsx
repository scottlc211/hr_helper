
import React, { useState, useCallback, useEffect } from 'react';
import { 
  Users, 
  Trophy, 
  LayoutGrid, 
  Upload, 
  Trash2, 
  RotateCcw,
  Sparkles,
  ChevronRight
} from 'lucide-react';
import { Participant, AppTab } from './types';
import SourcePanel from './components/SourcePanel';
import LuckyDrawPanel from './components/LuckyDrawPanel';
import GroupingPanel from './components/GroupingPanel';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AppTab>(AppTab.Source);
  const [participants, setParticipants] = useState<Participant[]>([]);

  // Load from local storage on mount
  useEffect(() => {
    const saved = localStorage.getItem('hr_event_participants');
    if (saved) {
      try {
        setParticipants(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse saved participants");
      }
    }
  }, []);

  // Save to local storage
  useEffect(() => {
    localStorage.setItem('hr_event_participants', JSON.stringify(participants));
  }, [participants]);

  const handleUpdateParticipants = (newList: Participant[]) => {
    setParticipants(newList);
  };

  const handleClearAll = () => {
    if (window.confirm("Are you sure you want to clear the entire participant list?")) {
      setParticipants([]);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-30 px-6 py-4 backdrop-blur-sm bg-white/10 border-b border-white/20">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-br from-amber-400 to-orange-500 p-2 rounded-xl shadow-lg shadow-orange-500/20">
              <Sparkles className="text-white w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white drop-shadow-md">Annual Meeting 2025</h1>
              <p className="text-xs text-orange-100 font-medium">Lucky Draw & Smart Grouping</p>
            </div>
          </div>

          <div className="flex items-center space-x-2 text-sm">
            <span className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-white font-semibold border border-white/30 shadow-sm">
              {participants.length} Participants
            </span>
            {participants.length > 0 && (
              <button 
                onClick={handleClearAll}
                className="p-2 text-white/70 hover:text-white hover:bg-white/20 rounded-lg transition-all"
                title="Clear All"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-4 md:p-8 flex flex-col md:flex-row gap-8">
        {/* Navigation Sidebar */}
        <nav className="md:w-64 space-y-2 shrink-0">
          <button
            onClick={() => setActiveTab(AppTab.Source)}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${
              activeTab === AppTab.Source 
                ? 'bg-gradient-to-r from-amber-100 to-white text-amber-800 shadow-lg font-bold border-l-4 border-amber-500' 
                : 'text-white/80 hover:bg-white/10 hover:text-white'
            }`}
          >
            <Users className="w-5 h-5" />
            <span>Manage List</span>
            {activeTab === AppTab.Source && <ChevronRight className="w-4 h-4 ml-auto text-amber-500" />}
          </button>

          <button
            onClick={() => setActiveTab(AppTab.LuckyDraw)}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${
              activeTab === AppTab.LuckyDraw 
                ? 'bg-gradient-to-r from-amber-100 to-white text-amber-800 shadow-lg font-bold border-l-4 border-amber-500' 
                : 'text-white/80 hover:bg-white/10 hover:text-white'
            }`}
          >
            <Trophy className="w-5 h-5" />
            <span>Lucky Draw</span>
            {activeTab === AppTab.LuckyDraw && <ChevronRight className="w-4 h-4 ml-auto text-amber-500" />}
          </button>

          <button
            onClick={() => setActiveTab(AppTab.Grouping)}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${
              activeTab === AppTab.Grouping 
                ? 'bg-gradient-to-r from-amber-100 to-white text-amber-800 shadow-lg font-bold border-l-4 border-amber-500' 
                : 'text-white/80 hover:bg-white/10 hover:text-white'
            }`}
          >
            <LayoutGrid className="w-5 h-5" />
            <span>Auto Grouping</span>
            {activeTab === AppTab.Grouping && <ChevronRight className="w-4 h-4 ml-auto text-amber-500" />}
          </button>
        </nav>

        {/* Dynamic Panels */}
        <div className="flex-1 min-w-0">
          <div className="glass-card rounded-3xl p-6 md:p-8 min-h-[600px] flex flex-col">
            {activeTab === AppTab.Source && (
              <SourcePanel participants={participants} onUpdate={handleUpdateParticipants} />
            )}
            {activeTab === AppTab.LuckyDraw && (
              <LuckyDrawPanel participants={participants} />
            )}
            {activeTab === AppTab.Grouping && (
              <GroupingPanel participants={participants} />
            )}
          </div>
        </div>
      </main>

      <footer className="border-t border-white/10 py-6 px-4 bg-black/10 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto text-center text-white/60 text-xs">
          © 2025 Annual Meeting Tool • Wish you good luck!
        </div>
      </footer>
    </div>
  );
};

export default App;
