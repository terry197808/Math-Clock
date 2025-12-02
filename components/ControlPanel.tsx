import React from 'react';
import { Play, Pause, RotateCcw, Plus, Minus, Sun, Moon, Hand } from 'lucide-react';

interface ControlPanelProps {
  onAddMinutes: (mins: number) => void;
  onSetSpecific: (totalMinutes: number) => void;
  isAnimating: boolean;
  toggleAnimation: () => void;
  reset: () => void;
  currentTotalMinutes: number;
}

export const ControlPanel: React.FC<ControlPanelProps> = ({ 
  onAddMinutes, 
  isAnimating, 
  toggleAnimation, 
  reset,
  currentTotalMinutes
}) => {
  
  const normalized = currentTotalMinutes % (24 * 60);
  const hour = Math.floor(normalized / 60);
  const isDay = hour >= 6 && hour < 18;

  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-100 flex flex-col gap-6">
      
      <div className="flex justify-between items-center border-b pb-4 border-slate-100">
        <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
          {isDay ? <Sun className="text-orange-400" /> : <Moon className="text-indigo-600" />}
          控制面板
        </h2>
        <div className="text-xs font-mono bg-slate-100 px-2 py-1 rounded text-slate-500">
            24小时制学习
        </div>
      </div>

      <div className="bg-gradient-to-r from-sky-100 to-blue-50 p-3 rounded-xl border border-sky-100 flex items-center gap-3">
        <div className="bg-white p-2 rounded-full shadow-sm text-sky-600">
            <Hand size={20} />
        </div>
        <p className="text-sm text-sky-800 font-medium">
            提示：你可以直接<span className="font-bold text-sky-900">拖动时针或分针</span>来拨动时间哦！
        </p>
      </div>

      {/* Main Controls Grid */}
      <div className="grid grid-cols-2 gap-4">
        
        {/* Minute Controls */}
        <div className="bg-blue-50 p-3 rounded-xl flex flex-col gap-2">
            <span className="text-sm font-semibold text-blue-700 text-center">分针微调</span>
            <div className="flex justify-center gap-2">
                <button onClick={() => onAddMinutes(-1)} className="p-2 bg-white text-blue-600 rounded shadow hover:bg-blue-100 active:scale-95 transition">
                    <Minus size={16} /> 1
                </button>
                <button onClick={() => onAddMinutes(1)} className="p-2 bg-white text-blue-600 rounded shadow hover:bg-blue-100 active:scale-95 transition">
                    <Plus size={16} /> 1
                </button>
                <button onClick={() => onAddMinutes(5)} className="p-2 bg-white text-blue-600 rounded shadow hover:bg-blue-100 active:scale-95 transition font-bold text-xs">
                    +5
                </button>
            </div>
        </div>

        {/* Hour Controls */}
        <div className="bg-red-50 p-3 rounded-xl flex flex-col gap-2">
            <span className="text-sm font-semibold text-red-700 text-center">整点调节</span>
            <div className="flex justify-center gap-2">
                <button onClick={() => onAddMinutes(-60)} className="p-2 bg-white text-red-600 rounded shadow hover:bg-red-100 active:scale-95 transition">
                    <Minus size={16} />
                </button>
                <button onClick={() => onAddMinutes(60)} className="p-2 bg-white text-red-600 rounded shadow hover:bg-red-100 active:scale-95 transition">
                    <Plus size={16} />
                </button>
            </div>
        </div>
      </div>

      {/* Playback Controls */}
      <div className="flex items-center justify-between gap-4 mt-2">
        <button 
          onClick={toggleAnimation}
          className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold shadow-md transition-all ${
            isAnimating 
              ? 'bg-amber-100 text-amber-700 hover:bg-amber-200' 
              : 'bg-emerald-500 text-white hover:bg-emerald-600'
          }`}
        >
          {isAnimating ? <><Pause size={20} /> 停止转动</> : <><Play size={20} /> 自动转动</>}
        </button>

        <button 
          onClick={reset}
          className="p-3 rounded-xl bg-slate-100 text-slate-600 hover:bg-slate-200 shadow-sm transition"
          title="重置时间"
        >
          <RotateCcw size={20} />
        </button>
      </div>

      <div className="text-sm text-slate-500 leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-100">
        <strong>知识点提示：</strong>
        <ul className="list-disc pl-4 mt-1 space-y-1">
            <li>1 天 = 24 小时</li>
            <li>1 小时 = 60 分钟</li>
            <li>时针走得慢，分针走得快</li>
        </ul>
      </div>
    </div>
  );
};