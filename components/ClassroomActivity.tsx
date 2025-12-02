
import React from 'react';
import { Users, Trophy, MoveRight } from 'lucide-react';

export const ClassroomActivity: React.FC = () => {
  return (
    <div className="bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden">
      
      <div className="bg-gradient-to-r from-orange-400 to-pink-500 p-6 text-white">
        <div className="flex items-center gap-3 mb-2">
            <div className="bg-white/20 p-2 rounded-lg">
                <Users size={24} />
            </div>
            <h2 className="text-2xl font-bold">小组活动：时间接龙</h2>
        </div>
        <p className="text-orange-50 font-medium opacity-90">
            动起来！用身体和智慧来感受时间的顺序。
        </p>
      </div>

      <div className="p-6 space-y-8">
        
        {/* Step 1 */}
        <div className="flex gap-4">
            <div className="flex-shrink-0 w-10 h-10 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center font-bold text-lg">
                1
            </div>
            <div>
                <h3 className="font-bold text-slate-800 text-lg mb-1">准备阶段</h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                    老师准备若干张<strong>时间卡片</strong>（可以是写着数字时间，也可以是画着钟面）。卡片上的时间要涵盖一天中的不同时刻（如：07:00, 09:30, 12:00, 15:45 等）。
                </p>
            </div>
        </div>

         {/* Step 2 */}
         <div className="flex gap-4">
            <div className="flex-shrink-0 w-10 h-10 bg-pink-100 text-pink-600 rounded-full flex items-center justify-center font-bold text-lg">
                2
            </div>
            <div>
                <h3 className="font-bold text-slate-800 text-lg mb-1">分组发牌</h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                    全班分成若干个小组（每组5-8人）。每位同学随机抽取一张时间卡片，不能给别人看，直到比赛开始。
                </p>
            </div>
        </div>

        {/* Step 3 */}
         <div className="flex gap-4">
            <div className="flex-shrink-0 w-10 h-10 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center font-bold text-lg">
                3
            </div>
            <div>
                <h3 className="font-bold text-slate-800 text-lg mb-1">开始排序</h3>
                <p className="text-slate-600 text-sm leading-relaxed mb-3">
                    老师一声令下，小组成员必须按照<strong>时间早晚</strong>的顺序排成一列纵队。
                </p>
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 flex items-center justify-center gap-2 text-slate-500 text-xs font-mono">
                    <span className="bg-white px-2 py-1 rounded shadow-sm border">07:00</span>
                    <MoveRight size={14} />
                    <span className="bg-white px-2 py-1 rounded shadow-sm border">09:30</span>
                    <MoveRight size={14} />
                    <span className="bg-white px-2 py-1 rounded shadow-sm border">12:15</span>
                </div>
            </div>
        </div>

         {/* Step 4 */}
         <div className="flex gap-4">
            <div className="flex-shrink-0 w-10 h-10 bg-yellow-100 text-yellow-600 rounded-full flex items-center justify-center font-bold text-lg">
                4
            </div>
            <div>
                <h3 className="font-bold text-slate-800 text-lg mb-1">获胜判定</h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                    最快排好队，并且顺序完全正确的小组获得<strong className="text-yellow-600">"时间小卫士"</strong>称号！
                </p>
                <div className="mt-2 inline-flex items-center gap-1 text-yellow-600 bg-yellow-50 px-3 py-1 rounded-full text-xs font-bold">
                    <Trophy size={12} /> 奖励：每人获得一张贴纸
                </div>
            </div>
        </div>

      </div>
    </div>
  );
};
