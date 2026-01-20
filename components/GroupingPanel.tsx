import React, { useState } from 'react';
import { LayoutGrid, Settings2, RefreshCw, Wand2, FileDown, Copy, Check } from 'lucide-react';
import { Participant, Group } from '../types';
import { generateTeamNames } from '../services/geminiService';

interface Props {
  participants: Participant[];
}

const GroupingPanel: React.FC<Props> = ({ participants }) => {
  const [groupSize, setGroupSize] = useState(2);
  const [groups, setGroups] = useState<Group[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);

  const shuffleArray = <T,>(array: T[]): T[] => {
    const newArr = [...array];
    for (let i = newArr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
    }
    return newArr;
  };

  const performGrouping = async () => {
    if (participants.length < 2) {
      alert("名单至少需要 2 人才能分组。");
      return;
    }

    setIsGenerating(true);
    
    const shuffled: Participant[] = shuffleArray(participants);
    const numGroups = Math.ceil(shuffled.length / groupSize);
    
    let names: string[] = [];
    try {
      names = await generateTeamNames(numGroups);
    } catch (e) {
      names = Array.from({ length: numGroups }, (_, i) => `Team ${i + 1}`);
    }

    const newGroups: Group[] = [];
    for (let i = 0; i < numGroups; i++) {
      const members = shuffled.slice(i * groupSize, (i + 1) * groupSize);
      if (members.length > 0) {
        newGroups.push({
          id: Math.random().toString(36).substr(2, 9),
          name: names[i] || `Group ${i + 1}`,
          members
        });
      }
    }

    setGroups(newGroups);
    setIsGenerating(false);
  };

  const copyToClipboard = () => {
    const text = groups.map(g => {
      return `--- ${g.name} ---\n${g.members.map(m => `• ${m.name}`).join('\n')}`;
    }).join('\n\n');

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadCSV = () => {
    const headers = "Group Name,Participant Name\n";
    const rows = groups.flatMap(g => 
      g.members.map(m => `"${g.name}","${m.name}"`)
    ).join("\n");
    
    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `grouping_results_${new Date().toLocaleDateString()}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const stickyColors = [
    'bg-highlight', // Yellow
    'bg-rose-100', // Pink
    'bg-blue-100', // Blue
    'bg-green-100', // Green
    'bg-orange-100', // Orange
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-left-2 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b-2 border-dashed border-ink/20 pb-6">
        <div>
          <h2 className="text-3xl font-heading font-bold text-ink flex items-center space-x-2 transform -rotate-1">
            <div className="bg-highlight text-ink p-2 border-2 border-ink rounded-wobbly-sm shadow-hard-sm">
                <LayoutGrid className="w-6 h-6" strokeWidth={2.5} />
            </div>
            <span>Smart Grouping</span>
          </h2>
          <p className="text-ink-light font-bold mt-2 ml-2">Automatically shuffle and assign teams</p>
        </div>

        <div className="flex items-center space-x-4 bg-paper border-2 border-ink p-3 rounded-wobbly shadow-hard-sm transform rotate-1">
          <div className="flex items-center space-x-3 px-4 py-2 bg-white rounded-wobbly-sm border-2 border-ink">
             <Settings2 className="w-4 h-4 text-ink" />
             <label className="text-sm font-bold text-ink whitespace-nowrap">Group Size:</label>
             <input 
               type="number" 
               min="1" 
               max={participants.length}
               value={groupSize} 
               onChange={(e) => setGroupSize(Number(e.target.value))}
               className="w-12 text-center font-bold text-secondary focus:outline-none bg-transparent"
             />
          </div>
          <button
            onClick={performGrouping}
            disabled={isGenerating || participants.length < 2}
            className="bg-secondary text-white border-2 border-ink px-6 py-2.5 rounded-wobbly-sm font-bold text-sm hover:bg-secondary/90 disabled:opacity-50 transition-all flex items-center space-x-2 shadow-hard-sm hover:shadow-none hover:translate-x-[1px] hover:translate-y-[1px]"
          >
            {isGenerating ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <Wand2 className="w-4 h-4" />
            )}
            <span>{isGenerating ? 'Generating...' : 'Group Now'}</span>
          </button>
        </div>
      </div>

      {groups.length > 0 ? (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
             <h3 className="text-xl font-heading font-bold text-ink uppercase tracking-widest transform rotate-1">Results Preview</h3>
             <div className="flex items-center space-x-4">
               <button 
                 onClick={copyToClipboard}
                 className="flex items-center space-x-2 text-sm font-bold text-ink hover:text-secondary transition-colors border-2 border-transparent hover:border-ink px-2 py-1 rounded-wobbly-sm"
               >
                 {copied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
                 <span>{copied ? 'Copied!' : 'Copy Text'}</span>
               </button>
               <button 
                 onClick={downloadCSV}
                 className="flex items-center space-x-2 text-sm font-bold text-ink hover:text-secondary transition-colors border-2 border-transparent hover:border-ink px-2 py-1 rounded-wobbly-sm"
               >
                 <FileDown className="w-4 h-4" />
                 <span>Download CSV</span>
               </button>
             </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {groups.map((group, gIdx) => (
              <div 
                key={group.id} 
                className={`border-2 border-ink rounded-wobbly p-6 hover:scale-105 transition-all shadow-hard hover:shadow-hard-lg group animate-in zoom-in-95 duration-300 relative
                    ${stickyColors[gIdx % stickyColors.length]}
                `}
                style={{ 
                    animationDelay: `${gIdx * 100}ms`,
                    transform: `rotate(${gIdx % 2 === 0 ? '1deg' : '-1deg'})`
                }}
              >
                {/* Tape effect */}
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-24 h-6 bg-white/40 backdrop-blur-sm transform -rotate-1 border border-white/50 shadow-sm"></div>

                <div className="flex items-center justify-between mb-4 mt-2">
                   <h4 className="text-xl font-heading font-bold text-ink truncate pr-2">{group.name}</h4>
                   <span className="px-2 py-1 bg-white border-2 border-ink text-ink text-xs font-black uppercase rounded-full shrink-0 transform rotate-2">
                     {group.members.length}
                   </span>
                </div>
                <ul className="space-y-2">
                  {group.members.map((member, mIdx) => (
                    <li key={member.id} className="flex items-center space-x-3 group/item">
                       <div className="w-2 h-2 rounded-full border border-ink bg-white group-hover/item:bg-accent transition-colors" />
                       <span className="text-ink text-lg font-bold">{member.name}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center py-24 border-4 border-dashed border-muted rounded-wobbly bg-white/50">
          <div className="bg-white p-6 rounded-full border-2 border-ink shadow-hard mb-6 transform -rotate-3">
             <LayoutGrid className="w-12 h-12 text-ink" strokeWidth={1.5} />
          </div>
          <h3 className="text-2xl font-heading font-bold text-ink">Ready to group?</h3>
          <p className="text-ink-light font-bold mt-2">Set group size and click "Group Now"</p>
          {participants.length < 2 && (
             <div className="mt-6 px-6 py-3 bg-accent text-white rounded-wobbly-sm text-sm font-bold border-2 border-ink shadow-hard-sm transform rotate-1 animate-pulse">
                Please add at least 2 participants first.
             </div>
          )}
        </div>
      )}
    </div>
  );
};

export default GroupingPanel;
