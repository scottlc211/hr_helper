import React, { useState, useRef, useEffect } from 'react';
import { Trophy, Play, RotateCcw, History, Trash2, Gift, Sparkles, PartyPopper } from 'lucide-react';
import confetti from 'canvas-confetti';
import { Participant, DrawWinner } from '../types';

interface Props {
  participants: Participant[];
}

const LuckyDrawPanel: React.FC<Props> = ({ participants }) => {
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentName, setCurrentName] = useState<string>('Ready?');
  const [winners, setWinners] = useState<DrawWinner[]>([]);
  const [allowRepeat, setAllowRepeat] = useState(false);
  const [lastWinner, setLastWinner] = useState<string | null>(null);
  
  const timerRef = useRef<number | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  const availableParticipants = allowRepeat 
    ? participants 
    : participants.filter(p => !winners.some(w => w.name === p.name));

  // Fireworks effect
  const triggerFireworks = () => {
    const duration = 3000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#ff0000', '#ffd700', '#ffffff']
      });
      confetti({
        particleCount: 5,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#ff0000', '#ffd700', '#ffffff']
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };

    frame();
  };

  const startDraw = () => {
    if (availableParticipants.length === 0) {
      alert("No participants left to draw from!");
      return;
    }
    
    setIsDrawing(true);
    setLastWinner(null);
    
    let speed = 50;
    let lastTime = Date.now();
    const duration = 3000; // Run for at least 3 seconds
    const startTime = Date.now();

    const animate = () => {
      const now = Date.now();
      const elapsed = now - startTime;

      if (now - lastTime > speed) {
        const randomIndex = Math.floor(Math.random() * availableParticipants.length);
        setCurrentName(availableParticipants[randomIndex].name);
        lastTime = now;
        
        // Dynamic speed adjustment
        if (elapsed < duration * 0.7) {
            speed = Math.max(30, speed - 2); // Accelerate
        } else {
            speed = Math.min(300, speed * 1.1); // Decelerate
        }
      }

      if (elapsed < duration || speed < 200) {
        animationFrameRef.current = requestAnimationFrame(animate);
      } else {
        // Final winner
        const finalIndex = Math.floor(Math.random() * availableParticipants.length);
        const winner = availableParticipants[finalIndex];
        
        setCurrentName(winner.name);
        setWinners(prev => [{ 
          id: Math.random().toString(36).substr(2, 9), 
          name: winner.name, 
          timestamp: Date.now() 
        }, ...prev]);
        
        setLastWinner(winner.name);
        setIsDrawing(false);
        triggerFireworks();
      }
    };

    animate();
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, []);

  const clearHistory = () => {
    if (window.confirm("Clear winner history?")) {
      setWinners([]);
      setLastWinner(null);
      setCurrentName('Ready?');
    }
  };

  return (
    <div className="space-y-8 h-full flex flex-col animate-in fade-in slide-in-from-right-2">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 flex items-center space-x-2">
            <div className="bg-red-100 p-2 rounded-lg">
                <Trophy className="text-red-600 w-6 h-6" />
            </div>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-red-600 to-amber-600">Lucky Draw</span>
          </h2>
          <p className="text-slate-500 mt-1">Spin the wheel and pick a lucky winner!</p>
        </div>
        
        <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
          <button 
            onClick={() => setAllowRepeat(false)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${!allowRepeat ? 'bg-white text-red-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            No Repeat
          </button>
          <button 
            onClick={() => setAllowRepeat(true)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${allowRepeat ? 'bg-white text-red-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            Allow Repeat
          </button>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Draw Area */}
        <div className="relative group perspective-1000">
            <div className={`absolute -inset-1 bg-gradient-to-r from-red-600 to-amber-600 rounded-[2rem] blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200 ${isDrawing ? 'animate-pulse opacity-75' : ''}`}></div>
            <div className="relative space-y-6 flex flex-col items-center justify-center p-8 bg-white rounded-[1.8rem] border border-slate-100 overflow-hidden min-h-[450px] shadow-xl">
            
            {/* Decorative Elements */}
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-red-500 via-amber-500 to-red-500"></div>
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-red-50 rounded-full blur-3xl opacity-50"></div>
            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-amber-50 rounded-full blur-3xl opacity-50"></div>
            
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#ef4444 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>

            {/* Main Display */}
            <div className="relative z-10 flex flex-col items-center">
                <div className={`text-6xl md:text-8xl font-black text-center transition-all duration-100 transform 
                    ${isDrawing ? 'scale-110 blur-[1px] text-slate-800' : 'scale-100'} 
                    ${lastWinner ? 'gradient-text scale-125 drop-shadow-lg' : 'text-slate-300'}
                `}>
                    {currentName}
                </div>
                
                {/* Winner Badge */}
                {!isDrawing && lastWinner && (
                    <div className="mt-8 animate-bounce">
                        <span className="inline-flex items-center space-x-2 px-6 py-2 rounded-full bg-gradient-to-r from-red-500 to-amber-500 text-white font-bold shadow-lg transform hover:scale-105 transition-transform">
                            <PartyPopper className="w-5 h-5" />
                            <span>Congratulations!</span>
                            <PartyPopper className="w-5 h-5" />
                        </span>
                    </div>
                )}
            </div>

            <div className="pt-12 z-10">
                <button
                onClick={startDraw}
                disabled={isDrawing || participants.length === 0}
                className={`group relative overflow-hidden px-16 py-6 rounded-2xl text-2xl font-black uppercase tracking-wider transition-all transform hover:-translate-y-1 active:translate-y-0 shadow-xl ${
                    isDrawing || participants.length === 0
                    ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-red-600 to-amber-500 text-white shadow-red-200 hover:shadow-red-300'
                }`}
                >
                <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-shimmer"></div>
                <div className="flex items-center space-x-4">
                    {isDrawing ? (
                        <RotateCcw className="w-8 h-8 animate-spin" />
                    ) : (
                        <Play className="w-8 h-8 fill-current" />
                    )}
                    <span>{isDrawing ? 'Rolling...' : 'START'}</span>
                </div>
                </button>
            </div>

            {participants.length === 0 && (
                <p className="mt-4 text-sm text-red-500 font-medium bg-red-50 px-4 py-2 rounded-lg">
                    ⚠️ Please add participants first
                </p>
            )}
            </div>
        </div>

        {/* History Area */}
        <div className="space-y-4 bg-white/50 backdrop-blur-sm p-6 rounded-3xl border border-slate-100 shadow-sm h-full">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider flex items-center space-x-2">
              <History className="w-4 h-4" />
              <span>Winners Podium</span>
            </h3>
            {winners.length > 0 && (
              <button 
                onClick={clearHistory}
                className="text-xs font-semibold text-slate-400 hover:text-red-500 flex items-center space-x-1 px-2 py-1 hover:bg-red-50 rounded transition-colors"
              >
                <Trash2 className="w-3 h-3" />
                <span>Clear</span>
              </button>
            )}
          </div>

          <div className="max-h-[400px] overflow-y-auto pr-2 custom-scrollbar space-y-3">
            {winners.length === 0 ? (
              <div className="py-16 flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-2xl text-slate-300 group hover:border-amber-200 transition-colors">
                <Trophy className="w-12 h-12 mb-3 text-slate-200 group-hover:text-amber-200 transition-colors" />
                <p className="text-sm font-medium">Waiting for the first winner...</p>
              </div>
            ) : (
              winners.map((winner, idx) => (
                <div 
                  key={winner.id} 
                  className="group flex items-center justify-between p-4 bg-white border border-slate-100 rounded-2xl shadow-sm hover:shadow-md transition-all animate-in slide-in-from-top-2 hover:border-amber-200"
                >
                  <div className="flex items-center space-x-4">
                    <div className={`
                        w-10 h-10 rounded-full flex items-center justify-center font-black text-sm border-2
                        ${idx === 0 ? 'bg-amber-100 text-amber-600 border-amber-200' : 
                          idx === 1 ? 'bg-slate-100 text-slate-600 border-slate-200' :
                          idx === 2 ? 'bg-orange-50 text-orange-600 border-orange-100' :
                          'bg-slate-50 text-slate-400 border-slate-100'}
                    `}>
                      {winners.length - idx}
                    </div>
                    <div>
                        <span className="block font-bold text-slate-800 text-lg group-hover:text-red-600 transition-colors">{winner.name}</span>
                        <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wide">
                            {new Date(winner.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                        </span>
                    </div>
                  </div>
                  {idx === 0 && <Trophy className="w-5 h-5 text-amber-400" />}
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
