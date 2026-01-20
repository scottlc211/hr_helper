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

  // Fireworks effect (Preserved)
  const triggerFireworks = () => {
    const duration = 3000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#ff4d4d', '#ffd700', '#ffffff', '#2d5da1']
      });
      confetti({
        particleCount: 5,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#ff4d4d', '#ffd700', '#ffffff', '#2d5da1']
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
    const duration = 3000;
    const startTime = Date.now();

    const animate = () => {
      const now = Date.now();
      const elapsed = now - startTime;

      if (now - lastTime > speed) {
        const randomIndex = Math.floor(Math.random() * availableParticipants.length);
        setCurrentName(availableParticipants[randomIndex].name);
        lastTime = now;
        
        if (elapsed < duration * 0.7) {
            speed = Math.max(30, speed - 2);
        } else {
            speed = Math.min(300, speed * 1.1);
        }
      }

      if (elapsed < duration || speed < 200) {
        animationFrameRef.current = requestAnimationFrame(animate);
      } else {
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
    <div className="space-y-8 h-full flex flex-col">
      <div className="flex items-center justify-between border-b-2 border-dashed border-ink/20 pb-6">
        <div>
          <h2 className="text-4xl font-heading font-bold text-ink flex items-center space-x-3 transform -rotate-1">
            <div className="bg-highlight p-2 border-2 border-ink rounded-full shadow-hard-sm">
                <Trophy className="text-ink w-8 h-8" strokeWidth={2.5} />
            </div>
            <span>Lucky Draw</span>
          </h2>
          <p className="text-ink-light font-bold mt-2 ml-2">Spin the wheel and pick a lucky winner!</p>
        </div>
        
        <div className="flex items-center bg-paper border-2 border-ink rounded-wobbly p-2 shadow-hard-sm transform rotate-1">
          <button 
            onClick={() => setAllowRepeat(false)}
            className={`px-4 py-2 rounded-wobbly-sm font-bold transition-all border-2 ${!allowRepeat ? 'bg-accent text-white border-ink shadow-hard-sm' : 'bg-transparent text-ink-light border-transparent hover:bg-muted'}`}
          >
            No Repeat
          </button>
          <button 
            onClick={() => setAllowRepeat(true)}
            className={`px-4 py-2 rounded-wobbly-sm font-bold transition-all border-2 ${allowRepeat ? 'bg-secondary text-white border-ink shadow-hard-sm' : 'bg-transparent text-ink-light border-transparent hover:bg-muted'}`}
          >
            Allow Repeat
          </button>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        {/* Draw Area */}
        <div className="relative group">
            {/* Sketchy background layers */}
            <div className="absolute inset-0 bg-ink rounded-wobbly transform translate-x-2 translate-y-2 z-0"></div>
            
            <div className="relative z-10 bg-paper border-2 border-ink rounded-wobbly p-8 flex flex-col items-center justify-center min-h-[450px] overflow-hidden">
                
                {/* Decorative corners */}
                <div className="absolute top-4 left-4 w-4 h-4 border-t-4 border-l-4 border-ink rounded-tl-lg"></div>
                <div className="absolute top-4 right-4 w-4 h-4 border-t-4 border-r-4 border-ink rounded-tr-lg"></div>
                <div className="absolute bottom-4 left-4 w-4 h-4 border-b-4 border-l-4 border-ink rounded-bl-lg"></div>
                <div className="absolute bottom-4 right-4 w-4 h-4 border-b-4 border-r-4 border-ink rounded-br-lg"></div>

                {/* Main Display */}
                <div className="relative z-10 flex flex-col items-center w-full">
                    <div className={`text-7xl md:text-9xl font-heading font-bold text-center transition-all duration-100 transform 
                        ${isDrawing ? 'scale-110 blur-[1px] text-ink rotate-1' : 'scale-100 -rotate-1'} 
                        ${lastWinner ? 'text-accent scale-110 drop-shadow-md' : 'text-ink'}
                    `}>
                        {currentName}
                    </div>
                    
                    {/* Winner Badge */}
                    {!isDrawing && lastWinner && (
                        <div className="mt-8 animate-jiggle">
                            <span className="inline-flex items-center space-x-2 px-6 py-3 border-2 border-ink bg-highlight text-ink font-bold shadow-hard transform rotate-2 text-xl rounded-wobbly">
                                <PartyPopper className="w-6 h-6" />
                                <span>Winner!</span>
                                <PartyPopper className="w-6 h-6" />
                            </span>
                        </div>
                    )}
                </div>

                <div className="pt-12 z-10 w-full flex justify-center">
                    <button
                    onClick={startDraw}
                    disabled={isDrawing || participants.length === 0}
                    className={`group relative px-12 py-6 rounded-wobbly text-3xl font-heading font-bold transition-all transform ${
                        isDrawing || participants.length === 0
                        ? 'bg-muted text-ink-light border-2 border-ink cursor-not-allowed opacity-50'
                        : 'bg-accent text-white border-2 border-ink shadow-hard hover:shadow-hard-sm hover:translate-x-[2px] hover:translate-y-[2px] active:shadow-none active:translate-x-[4px] active:translate-y-[4px]'
                    }`}
                    >
                    <div className="flex items-center space-x-4">
                        {isDrawing ? (
                            <RotateCcw className="w-8 h-8 animate-spin" />
                        ) : (
                            <Play className="w-8 h-8 fill-current" />
                        )}
                        <span>{isDrawing ? 'ROLLING...' : 'START DRAW'}</span>
                    </div>
                    </button>
                </div>

                {participants.length === 0 && (
                    <div className="mt-6 bg-highlight border-2 border-ink p-4 rounded-wobbly transform -rotate-1 shadow-hard-sm">
                        <p className="text-ink font-bold flex items-center gap-2">
                            <span className="text-2xl">⚠️</span> Please add participants first!
                        </p>
                    </div>
                )}
            </div>
        </div>

        {/* History Area */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-heading font-bold text-ink uppercase tracking-wider flex items-center space-x-2 border-b-4 border-highlight inline-block transform rotate-1 px-2">
              <History className="w-5 h-5" />
              <span>Winners Board</span>
            </h3>
            {winners.length > 0 && (
              <button 
                onClick={clearHistory}
                className="text-sm font-bold text-ink hover:text-accent flex items-center space-x-1 px-3 py-1 border-2 border-transparent hover:border-ink hover:bg-white rounded-full transition-all"
              >
                <Trash2 className="w-4 h-4" />
                <span>Clear</span>
              </button>
            )}
          </div>

          <div className="max-h-[500px] overflow-y-auto pr-4 custom-scrollbar space-y-4 p-2">
            {winners.length === 0 ? (
              <div className="py-16 flex flex-col items-center justify-center border-4 border-dashed border-muted rounded-wobbly text-ink-light group hover:border-ink/30 transition-colors">
                <Trophy className="w-16 h-16 mb-4 opacity-20 group-hover:opacity-40 transition-opacity" />
                <p className="text-xl font-heading">Waiting for winners...</p>
              </div>
            ) : (
              winners.map((winner, idx) => (
                <div 
                  key={winner.id} 
                  className={`flex items-center justify-between p-4 border-2 border-ink shadow-hard-sm transition-all animate-in slide-in-from-top-2 hover:scale-[1.02] hover:rotate-1
                    ${idx === 0 ? 'bg-highlight rounded-wobbly rotate-1' : 
                      idx % 2 === 0 ? 'bg-white rounded-wobbly-sm -rotate-1' : 
                      'bg-paper rounded-wobbly rotate-1'}
                  `}
                >
                  <div className="flex items-center space-x-4">
                    <div className={`
                        w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg border-2 border-ink
                        ${idx === 0 ? 'bg-accent text-white' : 'bg-white text-ink'}
                    `}>
                      {winners.length - idx}
                    </div>
                    <div>
                        <span className="block font-heading font-bold text-ink text-2xl">{winner.name}</span>
                        <span className="text-xs font-bold text-ink-light uppercase tracking-wide bg-muted/30 px-2 py-0.5 rounded-full">
                            {new Date(winner.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                        </span>
                    </div>
                  </div>
                  {idx === 0 && <Trophy className="w-6 h-6 text-ink fill-highlight" strokeWidth={2.5} />}
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
