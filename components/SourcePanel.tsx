import React, { useState, useMemo } from 'react';
import { Trash2, ListChecks, FileSpreadsheet, Users, UserPlus, AlertCircle, Sparkles } from 'lucide-react';
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
      <div className="flex justify-between items-start border-b-2 border-dashed border-ink/20 pb-6">
        <div>
          <h2 className="text-3xl font-heading font-bold text-ink flex items-center space-x-2 transform -rotate-1">
            <div className="bg-secondary text-white p-2 border-2 border-ink rounded-wobbly-sm shadow-hard-sm">
                <ListChecks className="w-6 h-6" strokeWidth={2.5} />
            </div>
            <span>Manage List</span>
          </h2>
          <p className="text-ink-light font-bold mt-2 ml-2">Import CSV or paste names directly</p>
        </div>
        <button
          onClick={handleLoadDummy}
          className="flex items-center space-x-2 text-sm font-bold text-ink bg-highlight border-2 border-ink px-4 py-2 rounded-wobbly-sm hover:bg-white transition-all shadow-hard-sm hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transform rotate-1"
        >
          <Sparkles className="w-4 h-4" />
          <span>Load Demo Data</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-4">
          <div className="relative group">
            <div className="absolute -top-3 left-4 bg-white px-2 font-heading font-bold text-ink z-10 border-2 border-ink rounded-md transform -rotate-2">
                Paste Names Here
            </div>
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Enter names here... (one per line)"
              className="w-full h-80 p-6 rounded-wobbly border-2 border-ink bg-paper focus:border-secondary focus:ring-0 transition-all outline-none text-ink resize-none font-bold text-lg shadow-hard-sm"
            />
            <div className="absolute bottom-4 right-4 flex space-x-3 z-10">
              <label className="cursor-pointer bg-white border-2 border-ink px-4 py-2 rounded-wobbly-sm text-ink text-sm font-bold hover:bg-muted transition-all flex items-center space-x-2 shadow-hard-sm hover:shadow-none hover:translate-x-[1px] hover:translate-y-[1px]">
                <FileSpreadsheet className="w-4 h-4" />
                <span>CSV</span>
                <input type="file" accept=".csv,.txt" onChange={handleFileUpload} className="hidden" />
              </label>
              <button
                onClick={handleAddNames}
                disabled={!inputText.trim()}
                className="bg-secondary text-white border-2 border-ink px-6 py-2 rounded-wobbly-sm text-sm font-bold hover:bg-secondary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-hard-sm hover:shadow-none hover:translate-x-[1px] hover:translate-y-[1px] flex items-center space-x-2"
              >
                <UserPlus className="w-4 h-4" />
                <span>Add Names</span>
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <h3 className="text-xl font-heading font-bold text-ink uppercase tracking-wider transform rotate-1">Current List</h3>
              <span className="text-sm font-bold px-3 py-1 bg-ink text-white rounded-wobbly-sm transform -rotate-2 border-2 border-transparent">{participants.length}</span>
            </div>
            {duplicateCount > 0 && (
              <button
                onClick={handleRemoveDuplicates}
                className="flex items-center space-x-1 text-xs font-bold text-white bg-accent px-3 py-1.5 rounded-wobbly-sm border-2 border-ink hover:bg-accent-hover transition-all animate-jiggle shadow-hard-sm"
              >
                <AlertCircle className="w-3.5 h-3.5" />
                <span>Fix {duplicateCount} Duplicates</span>
              </button>
            )}
          </div>
          
          <div className="h-80 overflow-y-auto pr-2 custom-scrollbar space-y-3 p-2 border-2 border-ink rounded-wobbly bg-white shadow-inner">
            {participants.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-ink-light opacity-50">
                <Users className="w-12 h-12 mb-2" strokeWidth={1.5} />
                <p className="text-lg font-heading">List is empty...</p>
              </div>
            ) : (
              participants.map((p, idx) => {
                const isDuplicate = nameCounts[p.name] > 1;
                return (
                  <div 
                    key={p.id} 
                    className={`flex items-center justify-between px-4 py-3 border-b-2 border-dashed border-muted last:border-0 group hover:bg-paper transition-colors ${
                      isDuplicate ? 'bg-red-50' : ''
                    }`}
                  >
                    <span className="text-lg font-bold text-ink flex items-center space-x-3">
                      <span className="text-ink-light/50 font-heading w-6">{idx + 1}.</span>
                      <span className={isDuplicate ? 'text-accent decoration-wavy underline' : ''}>{p.name}</span>
                      {isDuplicate && (
                        <span className="text-[10px] bg-accent text-white px-1.5 py-0.5 rounded border border-ink font-bold uppercase transform -rotate-2">Duplicate</span>
                      )}
                    </span>
                    <button 
                      onClick={() => removeParticipant(p.id)}
                      className="p-1 text-ink-light hover:text-accent transition-colors opacity-0 group-hover:opacity-100 transform hover:scale-110"
                    >
                      <Trash2 className="w-5 h-5" />
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
