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
    <div className="bg-white p-4 md:p-6 rounded-2xl shadow-lg border border-slate-100 flex flex-col gap-3 md:gap-6">
      
      {/* Header - Hidden on Mobile */}
      <div className="hidden md:flex justify-between items-center border-b pb-4 border-slate-100">
        <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
          {isDay ? <Sun className="text-orange-400" /> : <Moon className="text-indigo-600" />}
          控制面板
        </h2>
        <div className="text-xs font-mono bg-slate-100 px-2 py-1 rounded text-slate-500">
            24小时制学习
        </div>
      </div>

      <div className="bg-gradient-to-r from-sky-100 to-blue-50 p-2 md:p-3 rounded-xl border border-sky-100 flex items-center gap-3">
        <div className="bg-white p-1.5 md:p-2 rounded-full shadow-sm text-sky-600 shrink-0">
            <Hand size={16} className="md:w-5 md:h-5" />
        </div>
        <p className="text-xs md:text-sm text-sky-800 font-medium">
            提示：可以直接<span className="font-bold text-sky-900">拖动时针或分针</span>拨动时间！
        </p>
      </div>

      {/* Main Controls Grid */}
      <div className="grid grid-cols-2 gap-3 md:gap-4">
        
        {/* Minute Controls */}
        <div className="bg-blue-50 p-2 md:p-3 rounded-xl flex flex-col gap-2">
            <span className="text-xs md:text-sm font-semibold text-blue-700 text-center">分针微调</span>
            <div className="flex justify-center gap-1 md:gap-2">
                <button onClick={() => onAddMinutes(-1)} className="p-2 bg-white text-blue-600 rounded shadow hover:bg-blue-100 active:scale-95 transition flex-1 flex justify-center">
                    <Minus size={16} /> 
                </button>
                <button onClick={() => onAddMinutes(1)} className="p-2 bg-white text-blue-600 rounded shadow hover:bg-blue-100 active:scale-95 transition flex-1 flex justify-center">
                    <Plus size={16} /> 
                </button>
                <button onClick={() => onAddMinutes(5)} className="p-2 bg-white text-blue-600 rounded shadow hover:bg-blue-100 active:scale-95 transition font-bold text-xs flex-1 flex justify-center items-center">
                    +5
                </button>
            </div>
        </div>

        {/* Hour Controls */}
        <div className="bg-red-50 p-2 md:p-3 rounded-xl flex flex-col gap-2">
            <span className="text-xs md:text-sm font-semibold text-red-700 text-center">整点调节</span>
            <div className="flex justify-center gap-1 md:gap-2">
                <button onClick={() => onAddMinutes(-60)} className="p-2 bg-white text-red-600 rounded shadow hover:bg-red-100 active:scale-95 transition flex-1 flex justify-center">
                    <Minus size={16} />
                </button>
                <button onClick={() => onAddMinutes(60)} className="p-2 bg-white text-red-600 rounded shadow hover:bg-red-100 active:scale-95 transition flex-1 flex justify-center">
                    <Plus size={16} />
                </button>
            </div>
        </div>
      </div>

      {/* Playback Controls */}
      <div className="flex items-center justify-between gap-3 md:gap-4 mt-1 md:mt-2">
        <button 
          onClick={toggleAnimation}
          className={`flex-1 flex items-center justify-center gap-2 py-2 md:py-3 px-4 rounded-xl font-bold shadow-md transition-all text-sm md:text-base ${
            isAnimating 
              ? 'bg-amber-100 text-amber-700 hover:bg-amber-200' 
              : 'bg-emerald-500 text-white hover:bg-emerald-600'
          }`}
        >
          {isAnimating ? <><Pause size={18} /> 停止</> : <><Play size={18} /> 自动转动</>}
        </button>

        <button 
          onClick={reset}
          className="p-2 md:p-3 rounded-xl bg-slate-100 text-slate-600 hover:bg-slate-200 shadow-sm transition"
          title="重置时间"
        >
          <RotateCcw size={18} />
        </button>
      </div>

      <div className="text-xs md:text-sm text-slate-500 leading-relaxed bg-slate-50 p-2 md:p-3 rounded-lg border border-slate-100">
        <strong className="block mb-1">💡 知识点：</strong>
        <ul className="flex flex-col gap-1 pl-1">
            <li className="flex items-center gap-2">⏰ 1小时=60分，1天=24小时</li>
            <li className="flex items-center gap-2">🐢 时针短粗走得慢</li>
            <li className="flex items-center gap-2">🐇 分针细长走得快</li>
        </ul>
      </div>
    </div>
  );
};