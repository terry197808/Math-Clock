
import React, { useEffect, useState } from 'react';
import { getStats, getQuizHistory, clearQuizHistory } from '../services/statsService';
import { QuizResult } from '../types';
import { PieChart, Trash2, Trophy, AlertCircle, History } from 'lucide-react';

export const Statistics: React.FC = () => {
  const [stats, setStats] = useState<ReturnType<typeof getStats>>(null);
  const [history, setHistory] = useState<QuizResult[]>([]);

  const loadData = () => {
    setStats(getStats());
    setHistory(getQuizHistory());
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleClear = () => {
    if (window.confirm('确定要清空所有练习记录吗？')) {
      clearQuizHistory();
      loadData();
    }
  };

  // SVG Chart Components
  const CircularProgress = ({ percentage, color }: { percentage: number, color: string }) => {
    const radius = 30;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (percentage / 100) * circumference;

    return (
      <div className="relative flex items-center justify-center w-24 h-24">
        <svg className="transform -rotate-90 w-full h-full">
          <circle cx="50%" cy="50%" r={radius} stroke="#e2e8f0" strokeWidth="8" fill="transparent" />
          <circle 
            cx="50%" cy="50%" r={radius} 
            stroke={color} 
            strokeWidth="8" 
            fill="transparent" 
            strokeDasharray={circumference} 
            strokeDashoffset={offset} 
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <span className={`absolute text-xl font-bold ${percentage === 100 ? 'text-green-600' : 'text-slate-700'}`}>
          {percentage}%
        </span>
      </div>
    );
  };

  if (!stats) {
    return (
      <div className="bg-white p-8 rounded-2xl shadow-lg border border-slate-100 flex flex-col items-center justify-center text-center h-full">
        <div className="bg-slate-50 p-4 rounded-full mb-4">
          <PieChart size={48} className="text-slate-300" />
        </div>
        <h3 className="text-xl font-bold text-slate-800 mb-2">暂无数据</h3>
        <p className="text-slate-500">快去参加"闯关挑战"，你的成绩会显示在这里！</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden flex flex-col h-full max-h-[600px]">
      <div className="bg-gradient-to-r from-indigo-500 to-violet-600 p-6 text-white shrink-0">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
             <Trophy size={28} className="text-yellow-300" />
             <div>
               <h2 className="text-xl font-bold">学习成绩单</h2>
               <p className="text-indigo-100 text-sm">累计练习 {stats.total} 题</p>
             </div>
          </div>
          <button 
            onClick={handleClear}
            className="bg-white/10 hover:bg-white/20 p-2 rounded-lg transition"
            title="清空记录"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>

      <div className="p-6 overflow-y-auto custom-scrollbar">
        {/* Summary Cards */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-slate-50 p-4 rounded-xl flex flex-col items-center border border-slate-100">
            <h4 className="text-sm font-bold text-slate-500 mb-2">简单模式正确率</h4>
            {stats.easy.total > 0 ? (
               <CircularProgress percentage={stats.easy.accuracy} color="#8b5cf6" />
            ) : (
               <span className="text-slate-400 text-sm py-4">未挑战</span>
            )}
            <span className="text-xs text-slate-400 mt-1">共 {stats.easy.total} 题</span>
          </div>
          
          <div className="bg-slate-50 p-4 rounded-xl flex flex-col items-center border border-slate-100">
            <h4 className="text-sm font-bold text-slate-500 mb-2">高手模式正确率</h4>
            {stats.hard.total > 0 ? (
               <CircularProgress percentage={stats.hard.accuracy} color="#d946ef" />
            ) : (
               <span className="text-slate-400 text-sm py-4">未挑战</span>
            )}
             <span className="text-xs text-slate-400 mt-1">共 {stats.hard.total} 题</span>
          </div>
        </div>

        {/* History List */}
        <div>
          <h3 className="text-slate-800 font-bold flex items-center gap-2 mb-4">
            <History size={18} /> 最近记录
          </h3>
          <div className="space-y-3">
            {history.map((record) => (
              <div key={record.id} className="flex items-center justify-between bg-white border border-slate-100 p-3 rounded-xl shadow-sm hover:shadow-md transition">
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-12 rounded-full ${record.isCorrect ? 'bg-green-400' : 'bg-red-400'}`}></div>
                  <div>
                    <div className="flex items-center gap-2">
                       <span className="font-bold text-slate-700">{record.userTimeStr}</span>
                       <span className="text-xs text-slate-400">目标: {record.targetTimeStr}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs mt-1">
                      <span className={`px-1.5 py-0.5 rounded ${record.difficulty === 'easy' ? 'bg-violet-50 text-violet-600' : 'bg-fuchsia-50 text-fuchsia-600'}`}>
                        {record.difficulty === 'easy' ? '简单' : '高手'}
                      </span>
                      <span className="text-slate-400">
                        {new Date(record.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                      </span>
                    </div>
                  </div>
                </div>
                <div>
                   {record.isCorrect ? (
                     <div className="text-green-600 font-bold text-sm bg-green-50 px-2 py-1 rounded">正确</div>
                   ) : (
                     <div className="text-red-500 font-bold text-sm bg-red-50 px-2 py-1 rounded">错误</div>
                   )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
