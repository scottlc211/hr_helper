
import React, { useState, useMemo } from 'react';
import { Plus, Trash2, ListChecks, FileSpreadsheet, Users, UserPlus, AlertCircle, Sparkles } from 'lucide-react';
import { Participant } from '../types';

interface Props {
  participants: Participant[];
  onUpdate: (newList: Participant[]) => void;
}

const DUMMY_NAMES = [
  "王小明", "李梅", "张伟", "Alice Johnson", "David Chen", 
  "林志强", "赵丽", "Sarah Williams", "Kevin Park", "刘方",
  "Michael Brown", "Emma Wilson", "陈静", "周杰", "James Bond",
  "孙悟空", "卢克", "Princess Leia", "Tony Stark", "Peter Parker"
];

const SourcePanel: React.FC<Props> = ({ participants, onUpdate }) => {
  const [inputText, setInputText] = useState('');

  // 计算姓名出现的次数，用于标记重复
  const nameCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    participants.forEach(p => {
      counts[p.name] = (counts[p.name] || 0) + 1;
    });
    return counts;
  }, [participants]);

  const duplicateCount = useMemo(() => {
    return participants.filter(p => nameCounts[p.name] > 1).length;
  }, [participants, nameCounts]);

  const handleAddNames = () => {
    const lines = inputText.split(/[\n,;]+/).map(n => n.trim()).filter(n => n.length > 0);
    const newParticipants: Participant[] = lines.map(name => ({
      id: Math.random().toString(36).substr(2, 9),
      name
    }));
    onUpdate([...participants, ...newParticipants]);
    setInputText('');
  };

  const handleLoadDummy = () => {
    const newParticipants: Participant[] = DUMMY_NAMES.map(name => ({
      id: Math.random().toString(36).substr(2, 9),
      name
    }));
    onUpdate([...participants, ...newParticipants]);
  };

  const handleRemoveDuplicates = () => {
    const seen = new Set<string>();
    const uniqueList = participants.filter(p => {
      if (seen.has(p.name)) return false;
      seen.add(p.name);
      return true;
    });
    onUpdate(uniqueList);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      const lines = text.split(/[\n\r]+/).map(l => l.trim()).filter(l => l.length > 0);
      const newParticipants: Participant[] = lines.map(name => ({
        id: Math.random().toString(36).substr(2, 9),
        name: name.replace(/^"|"$/g, '')
      }));
      onUpdate([...participants, ...newParticipants]);
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const removeParticipant = (id: string) => {
    onUpdate(participants.filter(p => p.id !== id));
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 flex items-center space-x-2">
            <ListChecks className="text-indigo-600" />
            <span>名单导入与管理</span>
          </h2>
          <p className="text-slate-500 mt-1">上传 CSV 文件或直接粘贴姓名列表</p>
        </div>
        <button
          onClick={handleLoadDummy}
          className="flex items-center space-x-2 text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-2 rounded-xl hover:bg-indigo-100 transition-colors"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>加载模拟数据</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-4">
          <div className="relative">
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="在此粘贴姓名... (使用换行或逗号分隔)"
              className="w-full h-64 p-4 rounded-2xl border-2 border-slate-100 bg-slate-50 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50/50 transition-all outline-none text-slate-700 resize-none font-medium"
            />
            <div className="absolute bottom-4 right-4 flex space-x-2">
              <label className="cursor-pointer bg-white border border-slate-200 px-3 py-2 rounded-xl text-slate-600 text-sm font-semibold hover:bg-slate-50 transition-colors flex items-center space-x-2 shadow-sm">
                <FileSpreadsheet className="w-4 h-4" />
                <span>上传 CSV</span>
                <input type="file" accept=".csv,.txt" onChange={handleFileUpload} className="hidden" />
              </label>
              <button
                onClick={handleAddNames}
                disabled={!inputText.trim()}
                className="bg-indigo-600 text-white px-5 py-2 rounded-xl text-sm font-semibold hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md shadow-indigo-100 flex items-center space-x-2"
              >
                <UserPlus className="w-4 h-4" />
                <span>添加到列表</span>
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">当前名单</h3>
              <span className="text-xs font-semibold px-2 py-0.5 bg-slate-200 text-slate-600 rounded-full">{participants.length} 人</span>
            </div>
            {duplicateCount > 0 && (
              <button
                onClick={handleRemoveDuplicates}
                className="flex items-center space-x-1 text-xs font-bold text-rose-500 bg-rose-50 px-3 py-1 rounded-lg border border-rose-100 hover:bg-rose-100 transition-colors animate-pulse"
              >
                <AlertCircle className="w-3.5 h-3.5" />
                <span>移除 {duplicateCount} 个重复项</span>
              </button>
            )}
          </div>
          
          <div className="h-64 overflow-y-auto pr-2 custom-scrollbar space-y-2">
            {participants.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-2xl text-slate-400">
                <Users className="w-10 h-10 mb-2 opacity-20" />
                <p className="text-sm">名单为空</p>
              </div>
            ) : (
              participants.map((p, idx) => {
                const isDuplicate = nameCounts[p.name] > 1;
                return (
                  <div 
                    key={p.id} 
                    className={`flex items-center justify-between px-4 py-2 border rounded-xl transition-all group ${
                      isDuplicate 
                      ? 'bg-rose-50 border-rose-100' 
                      : 'bg-slate-50 border-slate-100 hover:border-indigo-200'
                    }`}
                  >
                    <span className="text-sm font-medium text-slate-700 flex items-center space-x-3">
                      <span className="text-slate-300 font-mono text-xs w-5">{idx + 1}.</span>
                      <span className={isDuplicate ? 'text-rose-700' : ''}>{p.name}</span>
                      {isDuplicate && (
                        <span className="text-[10px] bg-rose-200 text-rose-700 px-1.5 py-0.5 rounded font-bold uppercase">重复</span>
                      )}
                    </span>
                    <button 
                      onClick={() => removeParticipant(p.id)}
                      className="p-1 text-slate-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SourcePanel;
