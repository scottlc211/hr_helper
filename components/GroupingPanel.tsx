
import React, { useState } from 'react';
import { LayoutGrid, Users, Settings2, RefreshCw, Wand2, FileDown, Copy, Check } from 'lucide-react';
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

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-left-2 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 flex items-center space-x-2">
            <LayoutGrid className="text-indigo-600" />
            <span>智能自动分组</span>
          </h2>
          <p className="text-slate-500 mt-1">根据设定的人数自动打乱并分配小组</p>
        </div>

        <div className="flex items-center space-x-4 bg-slate-50 border border-slate-100 p-2 rounded-2xl">
          <div className="flex items-center space-x-3 px-4 py-2 bg-white rounded-xl shadow-sm border border-slate-100">
             <Settings2 className="w-4 h-4 text-slate-400" />
             <label className="text-sm font-bold text-slate-600 whitespace-nowrap">每组人数:</label>
             <input 
               type="number" 
               min="1" 
               max={participants.length}
               value={groupSize} 
               onChange={(e) => setGroupSize(Number(e.target.value))}
               className="w-12 text-center font-bold text-indigo-600 focus:outline-none"
             />
          </div>
          <button
            onClick={performGrouping}
            disabled={isGenerating || participants.length < 2}
            className="bg-indigo-600 text-white px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-indigo-700 disabled:opacity-50 transition-all flex items-center space-x-2 shadow-lg shadow-indigo-100"
          >
            {isGenerating ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <Wand2 className="w-4 h-4" />
            )}
            <span>{isGenerating ? '正在生成...' : '立即分组'}</span>
          </button>
        </div>
      </div>

      {groups.length > 0 ? (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
             <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest">分组结果预览</h3>
             <div className="flex items-center space-x-4">
               <button 
                 onClick={copyToClipboard}
                 className="flex items-center space-x-2 text-xs font-bold text-slate-500 hover:text-indigo-600 transition-colors"
               >
                 {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                 <span>{copied ? '已复制' : '复制文本'}</span>
               </button>
               <button 
                 onClick={downloadCSV}
                 className="flex items-center space-x-2 text-xs font-bold text-slate-500 hover:text-emerald-600 transition-colors"
               >
                 <FileDown className="w-4 h-4" />
                 <span>下载 CSV</span>
               </button>
             </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {groups.map((group, gIdx) => (
              <div 
                key={group.id} 
                className="bg-white border-2 border-slate-100 rounded-3xl p-6 hover:border-indigo-200 transition-all hover:shadow-xl hover:shadow-indigo-50/50 group animate-in zoom-in-95 duration-300"
                style={{ animationDelay: `${gIdx * 100}ms` }}
              >
                <div className="flex items-center justify-between mb-4">
                   <h4 className="text-lg font-black text-slate-800 truncate pr-2">{group.name}</h4>
                   <span className="px-3 py-1 bg-indigo-50 text-indigo-600 text-[10px] font-black uppercase rounded-full shrink-0">
                     {group.members.length} 人
                   </span>
                </div>
                <ul className="space-y-2">
                  {group.members.map((member, mIdx) => (
                    <li key={member.id} className="flex items-center space-x-3 group/item">
                       <div className="w-1.5 h-1.5 rounded-full bg-slate-200 group-hover/item:bg-indigo-400 transition-colors" />
                       <span className="text-slate-600 text-sm font-medium">{member.name}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center py-20 border-2 border-dashed border-slate-100 rounded-3xl bg-slate-50/30">
          <div className="bg-white p-4 rounded-3xl shadow-sm mb-4">
             <LayoutGrid className="w-12 h-12 text-slate-200" />
          </div>
          <h3 className="text-slate-500 font-bold">准备好开始分组了吗？</h3>
          <p className="text-slate-400 text-sm mt-1">设置组人数并点击“立即分组”</p>
          {participants.length < 2 && (
             <div className="mt-4 px-4 py-2 bg-rose-50 text-rose-500 rounded-xl text-xs font-bold border border-rose-100">
                请先导入至少 2 名参与者。
             </div>
          )}
        </div>
      )}
    </div>
  );
};

export default GroupingPanel;
