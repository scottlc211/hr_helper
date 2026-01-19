
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Trophy, Play, RotateCcw, Settings, History, Trash2, Gift } from 'lucide-react';
import { Participant, DrawWinner } from '../types';

interface Props {
  participants: Participant[];
}

const LuckyDrawPanel: React.FC<Props> = ({ participants }) => {
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentName, setCurrentName] = useState<string>('???');
  const [winners, setWinners] = useState<DrawWinner[]>([]);
  const [allowRepeat, setAllowRepeat] = useState(false);
  const [lastWinner, setLastWinner] = useState<string | null>(null);
  
  const timerRef = useRef<number | null>(null);

  const availableParticipants = allowRepeat 
    ? participants 
    : participants.filter(p => !winners.some(w => w.name === p.name));

  const startDraw = () => {
    if (availableParticipants.length === 0) {
      alert("No participants left to draw from!");
      return;
    }
    
    setIsDrawing(true);
    setLastWinner(null);
    let speed = 50;
    let count = 0;
    const maxCount = 40;

    const cycle = () => {
      const randomIndex = Math.floor(Math.random() * availableParticipants.length);
      setCurrentName(availableParticipants[randomIndex].name);
      
      count++;
      if (count < maxCount) {
        speed *= 1.05; // Slow down effect
        timerRef.current = window.setTimeout(cycle, speed);
      } else {
        const winner = availableParticipants[randomIndex];
        setWinners(prev => [{ 
          id: Math.random().toString(36).substr(2, 9), 
          name: winner.name, 
          timestamp: Date.now() 
        }, ...prev]);
        setLastWinner(winner.name);
        setIsDrawing(false);
      }
    };

    cycle();
  };

  const clearHistory = () => {
    if (window.confirm("Clear winner history?")) {
      setWinners([]);
      setLastWinner(null);
      setCurrentName('???');
    }
  };

  return (
    <div className="space-y-8 h-full flex flex-col animate-in fade-in slide-in-from-right-2">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 flex items-center space-x-2">
            <Trophy className="text-amber-500" />
            <span>Lucky Draw</span>
          </h2>
          <p className="text-slate-500 mt-1">Spin the wheel and pick a winner!</p>
        </div>
        
        <div className="flex items-center bg-slate-100 p-1 rounded-xl">
          <button 
            onClick={() => setAllowRepeat(false)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${!allowRepeat ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500'}`}
          >
            No Repeat
          </button>
          <button 
            onClick={() => setAllowRepeat(true)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${allowRepeat ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500'}`}
          >
            Allow Repeat
          </button>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Draw Area */}
        <div className="space-y-6 flex flex-col items-center justify-center p-8 bg-slate-50 rounded-3xl border-2 border-slate-100 relative overflow-hidden group min-h-[400px]">
          {/* Animated Background Decor */}
          <div className="absolute inset-0 pointer-events-none opacity-5">
             <Trophy className="w-64 h-64 absolute -bottom-10 -right-10 rotate-12" />
          </div>

          <div className={`text-6xl md:text-8xl font-black text-center transition-all transform ${isDrawing ? 'scale-110 blur-[2px]' : 'scale-100'} ${lastWinner ? 'text-indigo-600' : 'text-slate-800'}`}>
            {currentName}
          </div>

          <div className="pt-8">
            <button
              onClick={startDraw}
              disabled={isDrawing || participants.length === 0}
              className={`group relative overflow-hidden px-12 py-5 rounded-2xl text-xl font-bold transition-all transform hover:scale-105 active:scale-95 shadow-xl ${
                isDrawing || participants.length === 0
                  ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
                  : 'bg-indigo-600 text-white shadow-indigo-200'
              }`}
            >
              <div className="flex items-center space-x-3">
                {isDrawing ? (
                   <RotateCcw className="w-6 h-6 animate-spin" />
                ) : (
                   <Play className="w-6 h-6 fill-current" />
                )}
                <span>{isDrawing ? 'Picking...' : 'Draw Winner'}</span>
              </div>
            </button>
          </div>

          {!isDrawing && lastWinner && (
            <div className="mt-6 flex items-center space-x-2 text-amber-600 font-bold animate-bounce bg-amber-50 px-4 py-2 rounded-full border border-amber-100">
               <Gift className="w-4 h-4" />
               <span>Congratulations!</span>
            </div>
          )}

          {participants.length === 0 && (
            <p className="mt-4 text-sm text-red-500 font-medium">Please add participants first in the Manage List tab.</p>
          )}
          {availableParticipants.length === 0 && participants.length > 0 && !allowRepeat && (
            <p className="mt-4 text-sm text-red-500 font-medium">All participants have won! Clear history to restart.</p>
          )}
        </div>

        {/* History Area */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider flex items-center space-x-2">
              <History className="w-4 h-4" />
              <span>Winners History</span>
            </h3>
            {winners.length > 0 && (
              <button 
                onClick={clearHistory}
                className="text-xs font-semibold text-slate-400 hover:text-red-500 flex items-center space-x-1"
              >
                <Trash2 className="w-3 h-3" />
                <span>Clear</span>
              </button>
            )}
          </div>

          <div className="max-h-[350px] overflow-y-auto pr-2 custom-scrollbar space-y-2">
            {winners.length === 0 ? (
              <div className="py-12 flex flex-col items-center justify-center border border-dashed border-slate-200 rounded-2xl text-slate-300">
                <Gift className="w-8 h-8 mb-2" />
                <p className="text-sm">No winners yet</p>
              </div>
            ) : (
              winners.map((winner, idx) => (
                <div 
                  key={winner.id} 
                  className="flex items-center justify-between p-4 bg-white border border-slate-100 rounded-2xl shadow-sm animate-in slide-in-from-top-2"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold text-xs border border-indigo-100">
                      {winners.length - idx}
                    </div>
                    <span className="font-bold text-slate-700">{winner.name}</span>
                  </div>
                  <span className="text-[10px] font-medium text-slate-400 uppercase">
                    {new Date(winner.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LuckyDrawPanel;
