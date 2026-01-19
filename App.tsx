
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
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-indigo-600 p-2 rounded-xl">
              <Sparkles className="text-white w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900">HR Event Toolbox</h1>
              <p className="text-xs text-slate-500 font-medium">Lucky Draw & Smart Grouping</p>
            </div>
          </div>

          <div className="flex items-center space-x-2 text-sm">
            <span className="px-3 py-1 bg-slate-100 rounded-full text-slate-600 font-semibold">
              {participants.length} Participants
            </span>
            {participants.length > 0 && (
              <button 
                onClick={handleClearAll}
                className="p-2 text-slate-400 hover:text-red-500 transition-colors"
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
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200 font-semibold' 
                : 'text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Users className="w-5 h-5" />
            <span>Manage List</span>
            {activeTab === AppTab.Source && <ChevronRight className="w-4 h-4 ml-auto opacity-50" />}
          </button>

          <button
            onClick={() => setActiveTab(AppTab.LuckyDraw)}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${
              activeTab === AppTab.LuckyDraw 
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200 font-semibold' 
                : 'text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Trophy className="w-5 h-5" />
            <span>Lucky Draw</span>
            {activeTab === AppTab.LuckyDraw && <ChevronRight className="w-4 h-4 ml-auto opacity-50" />}
          </button>

          <button
            onClick={() => setActiveTab(AppTab.Grouping)}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${
              activeTab === AppTab.Grouping 
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200 font-semibold' 
                : 'text-slate-600 hover:bg-slate-200'
            }`}
          >
            <LayoutGrid className="w-5 h-5" />
            <span>Auto Grouping</span>
            {activeTab === AppTab.Grouping && <ChevronRight className="w-4 h-4 ml-auto opacity-50" />}
          </button>
        </nav>

        {/* Dynamic Panels */}
        <div className="flex-1 min-w-0">
          <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6 md:p-8 min-h-[600px] flex flex-col">
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

      <footer className="bg-white border-t border-slate-200 py-6 px-4">
        <div className="max-w-6xl mx-auto text-center text-slate-400 text-xs">
          © 2024 HR Events Pro Tool • Designed for modern workplaces
        </div>
      </footer>
    </div>
  );
};

export default App;
