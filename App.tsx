
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
    <div className="min-h-screen flex flex-col p-4 md:p-8 gap-8 max-w-7xl mx-auto w-full">
      {/* Header */}
      <header className="bg-white border-2 border-ink rounded-wobbly shadow-hard p-6 flex flex-col md:flex-row items-center justify-between transform -rotate-1 hover:rotate-0 transition-transform duration-300 z-20 relative">
        {/* Decorative Tape */}
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-32 h-8 bg-gray-200/50 rotate-2 backdrop-blur-sm z-10 pointer-events-none"></div>

        <div className="flex items-center space-x-4">
          <div className="bg-accent text-white p-3 rounded-wobbly-sm shadow-hard-sm transform rotate-3">
            <Sparkles className="w-8 h-8" strokeWidth={2.5} />
          </div>
          <div>
            <h1 className="text-4xl font-heading font-bold text-ink">HR Event Toolbox</h1>
            <p className="text-ink-light font-bold text-lg -mt-1 transform -rotate-1">Lucky Draw & Smart Grouping</p>
          </div>
        </div>

        <div className="flex items-center space-x-4 mt-4 md:mt-0">
          <div className="px-4 py-2 bg-highlight border-2 border-ink rounded-wobbly shadow-hard-sm font-bold text-ink transform rotate-1">
            {participants.length} Participants
          </div>
          {participants.length > 0 && (
            <button 
              onClick={handleClearAll}
              className="p-3 bg-white border-2 border-ink rounded-full hover:bg-accent hover:text-white transition-colors shadow-hard-sm hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px]"
              title="Clear All"
            >
              <Trash2 className="w-5 h-5" strokeWidth={2.5} />
            </button>
          )}
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col md:flex-row gap-8">
        {/* Navigation Sidebar */}
        <nav className="md:w-64 space-y-4 shrink-0 z-10">
          <button
            onClick={() => setActiveTab(AppTab.Source)}
            className={`w-full flex items-center space-x-3 px-6 py-4 border-2 border-ink rounded-wobbly transition-all duration-200 ${
              activeTab === AppTab.Source 
                ? 'bg-secondary text-white shadow-hard font-bold -rotate-1 scale-105' 
                : 'bg-white text-ink hover:bg-muted shadow-hard-sm hover:-rotate-1'
            }`}
          >
            <Users className="w-6 h-6" strokeWidth={2.5} />
            <span className="text-xl">Manage List</span>
            {activeTab === AppTab.Source && <ChevronRight className="w-5 h-5 ml-auto" strokeWidth={3} />}
          </button>

          <button
            onClick={() => setActiveTab(AppTab.LuckyDraw)}
            className={`w-full flex items-center space-x-3 px-6 py-4 border-2 border-ink rounded-wobbly transition-all duration-200 ${
              activeTab === AppTab.LuckyDraw 
                ? 'bg-accent text-white shadow-hard font-bold rotate-1 scale-105' 
                : 'bg-white text-ink hover:bg-muted shadow-hard-sm hover:rotate-1'
            }`}
          >
            <Trophy className="w-6 h-6" strokeWidth={2.5} />
            <span className="text-xl">Lucky Draw</span>
            {activeTab === AppTab.LuckyDraw && <ChevronRight className="w-5 h-5 ml-auto" strokeWidth={3} />}
          </button>

          <button
            onClick={() => setActiveTab(AppTab.Grouping)}
            className={`w-full flex items-center space-x-3 px-6 py-4 border-2 border-ink rounded-wobbly transition-all duration-200 ${
              activeTab === AppTab.Grouping 
                ? 'bg-highlight text-ink shadow-hard font-bold -rotate-1 scale-105' 
                : 'bg-white text-ink hover:bg-muted shadow-hard-sm hover:-rotate-1'
            }`}
          >
            <LayoutGrid className="w-6 h-6" strokeWidth={2.5} />
            <span className="text-xl">Auto Grouping</span>
            {activeTab === AppTab.Grouping && <ChevronRight className="w-5 h-5 ml-auto" strokeWidth={3} />}
          </button>
        </nav>

        {/* Dynamic Panels */}
        <div className="flex-1 min-w-0 relative">
          {/* Background decoration */}
          <div className="absolute -top-2 -left-2 w-full h-full border-2 border-ink rounded-wobbly bg-ink z-0"></div>
          
          <div className="bg-white border-2 border-ink rounded-wobbly p-6 md:p-10 min-h-[600px] flex flex-col relative z-10 transform -rotate-0">
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

      <footer className="text-center py-8 text-ink-light font-bold opacity-60">
        <p className="flex items-center justify-center gap-2">
          <span className="inline-block w-2 h-2 bg-ink rounded-full"></span>
          © 2025 HR Events Pro Tool
          <span className="inline-block w-2 h-2 bg-ink rounded-full"></span>
        </p>
      </footer>
    </div>
  );
};

export default App;
