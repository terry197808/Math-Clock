
import React, { useState } from 'react';
import { Calculator, ArrowRight, Check, X, Clock, Play } from 'lucide-react';

interface Scenario {
  id: number;
  title: string;
  description: string;
  startHour: number;
  startMinute: number;
  endHour: number;
  endMinute: number;
  explanation: string;
}

const SCENARIOS: Scenario[] = [
  {
    id: 1,
    title: "上学路上",
    description: "小明早上 07:30 从家出发，07:50 到达学校。",
    startHour: 7,
    startMinute: 30,
    endHour: 7,
    endMinute: 50,
    explanation: "分针从 6 走到 10，走了 4 大格，每格 5 分钟，所以是 20 分钟。"
  },
  {
    id: 2,
    title: "第一节课",
    description: "数学课 08:00 开始上课，08:40 下课。",
    startHour: 8,
    startMinute: 0,
    endHour: 8,
    endMinute: 40,
    explanation: "都在8点这一小时内。40 - 0 = 40 分钟。"
  },
  {
    id: 3,
    title: "课间操",
    description: "大课间从 09:50 开始，到 10:20 结束。",
    startHour: 9,
    startMinute: 50,
    endHour: 10,
    endMinute: 20,
    explanation: "这是一个跨过整点的时间。9:50 到 10:00 是 10 分钟，10:00 到 10:20 是 20 分钟。10 + 20 = 30 分钟。"
  },
  {
    id: 4,
    title: "午休时间",
    description: "午休时间从 12:00 开始，下午 14:00 结束。",
    startHour: 12,
    startMinute: 0,
    endHour: 14,
    endMinute: 0,
    explanation: "分针都在12的位置。时针从 12 走到 14 (下午2点)，走了 2 大格，所以是 2 小时。"
  },
  {
    id: 5,
    title: "放学做作业",
    description: "小刚下午 16:30 放学回到家，做作业到 17:45 结束。",
    startHour: 16,
    startMinute: 30,
    endHour: 17,
    endMinute: 45,
    explanation: "先算到17:30是一个小时，再多出15分钟。所以是1小时15分钟。"
  }
];

interface TimeCalculatorProps {
  onSetTime: (minutes: number) => void;
}

export const TimeCalculator: React.FC<TimeCalculatorProps> = ({ onSetTime }) => {
  const [step, setStep] = useState<'intro' | 'practice'>('intro');
  const [currentScenarioIndex, setCurrentScenarioIndex] = useState(0);
  const [userHours, setUserHours] = useState('');
  const [userMinutes, setUserMinutes] = useState('');
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);

  const scenario = SCENARIOS[currentScenarioIndex];

  const handleShowStart = () => {
    onSetTime(scenario.startHour * 60 + scenario.startMinute);
  };

  const handleShowEnd = () => {
    onSetTime(scenario.endHour * 60 + scenario.endMinute);
  };

  const checkAnswer = () => {
    const startTotal = scenario.startHour * 60 + scenario.startMinute;
    const endTotal = scenario.endHour * 60 + scenario.endMinute;
    const diff = endTotal - startTotal;
    
    const correctH = Math.floor(diff / 60);
    const correctM = diff % 60;

    const inputH = parseInt(userHours || '0');
    const inputM = parseInt(userMinutes || '0');

    if (inputH === correctH && inputM === correctM) {
        setFeedback('correct');
    } else {
        setFeedback('incorrect');
    }
  };

  const nextScenario = () => {
    setFeedback(null);
    setUserHours('');
    setUserMinutes('');
    if (currentScenarioIndex < SCENARIOS.length - 1) {
        setCurrentScenarioIndex(prev => prev + 1);
        // Automatically set clock to start of next scenario
        const next = SCENARIOS[currentScenarioIndex + 1];
        onSetTime(next.startHour * 60 + next.startMinute);
    } else {
        // Finished
        alert("恭喜你完成了所有练习！");
        setCurrentScenarioIndex(0);
        setStep('intro');
    }
  };

  if (step === 'intro') {
    return (
      <div className="space-y-6">
        <div className="bg-amber-50 p-6 rounded-2xl border border-amber-100">
            <h3 className="text-xl font-bold text-amber-800 mb-4 flex items-center gap-2">
                <Calculator size={24} />
                时间计算小课堂
            </h3>
            <p className="text-amber-900 mb-4">
                我们可以用减法来计算经过了多长时间：
            </p>
            <div className="flex items-center justify-center gap-4 text-lg font-bold text-slate-700 bg-white p-4 rounded-xl shadow-sm">
                <span className="text-slate-400">结束时间</span>
                <span className="text-slate-300">-</span>
                <span className="text-slate-400">开始时间</span>
                <span className="text-slate-300">=</span>
                <span className="text-green-600">经过的时间</span>
            </div>
            <div className="mt-6 text-sm text-amber-800 space-y-2">
                <p>💡 <strong>小窍门：</strong></p>
                <ul className="list-disc pl-5 space-y-1">
                    <li>先看时针走了几大格（小时）</li>
                    <li>再看分针走了几小格（分钟）</li>
                    <li>如果分针不够减，要向小时"借"1小时变成60分钟哦！</li>
                </ul>
            </div>
        </div>
        <button 
            onClick={() => {
                setStep('practice');
                handleShowStart(); // Set clock for first scenario
            }}
            className="w-full bg-amber-500 text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:bg-amber-600 transition flex items-center justify-center gap-2"
        >
            <Play fill="currentColor" /> 开始练习 (5题)
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-100 relative">
        <div className="flex justify-between items-center mb-6">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                场景 {currentScenarioIndex + 1} / {SCENARIOS.length}
            </span>
            <button onClick={() => setStep('intro')} className="text-slate-400 hover:text-slate-600 text-sm">
                返回教程
            </button>
        </div>

        <h3 className="text-xl font-bold text-slate-800 mb-2">{scenario.title}</h3>
        <p className="text-slate-600 mb-6">{scenario.description}</p>

        <div className="flex gap-3 mb-6">
            <button 
                onClick={handleShowStart}
                className="flex-1 py-2 px-3 bg-sky-50 text-sky-700 rounded-lg text-sm font-bold border border-sky-100 hover:bg-sky-100 transition flex items-center justify-center gap-2"
            >
                <Clock size={16} /> 看开始时间
            </button>
            <button 
                onClick={handleShowEnd}
                className="flex-1 py-2 px-3 bg-indigo-50 text-indigo-700 rounded-lg text-sm font-bold border border-indigo-100 hover:bg-indigo-100 transition flex items-center justify-center gap-2"
            >
                <Clock size={16} /> 看结束时间
            </button>
        </div>

        <div className="bg-slate-50 p-4 rounded-xl mb-6">
            <p className="text-sm font-bold text-slate-500 mb-3 text-center">经过了多久？</p>
            <div className="flex items-center justify-center gap-3">
                <div className="flex items-center gap-2">
                    <input 
                        type="number" 
                        value={userHours}
                        onChange={(e) => setUserHours(e.target.value)}
                        placeholder="0"
                        className="w-16 p-2 text-center text-xl font-bold rounded-lg border-2 border-slate-200 focus:border-amber-500 outline-none"
                    />
                    <span className="text-slate-600 font-bold">小时</span>
                </div>
                <div className="flex items-center gap-2">
                    <input 
                        type="number" 
                        value={userMinutes}
                        onChange={(e) => setUserMinutes(e.target.value)}
                        placeholder="0"
                        className="w-16 p-2 text-center text-xl font-bold rounded-lg border-2 border-slate-200 focus:border-amber-500 outline-none"
                    />
                    <span className="text-slate-600 font-bold">分钟</span>
                </div>
            </div>
        </div>

        {feedback === null && (
            <button 
                onClick={checkAnswer}
                className="w-full bg-slate-800 text-white py-3 rounded-xl font-bold hover:bg-slate-700 transition"
            >
                提交答案
            </button>
        )}

        {feedback === 'correct' && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
                <div className="bg-green-50 text-green-800 p-4 rounded-xl mb-4 border border-green-100">
                    <div className="flex items-center gap-2 font-bold mb-1">
                        <Check size={20} className="text-green-600" /> 回答正确!
                    </div>
                    <p className="text-sm text-green-700">{scenario.explanation}</p>
                </div>
                <button 
                    onClick={nextScenario}
                    className="w-full bg-green-500 text-white py-3 rounded-xl font-bold hover:bg-green-600 transition flex items-center justify-center gap-2"
                >
                    下一题 <ArrowRight size={18} />
                </button>
            </div>
        )}

        {feedback === 'incorrect' && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
                 <div className="bg-red-50 text-red-800 p-4 rounded-xl mb-4 border border-red-100">
                    <div className="flex items-center gap-2 font-bold mb-1">
                        <X size={20} className="text-red-600" /> 再试一次
                    </div>
                    <p className="text-sm">请仔细观察时钟。你可以点击上方的按钮切换开始和结束时间来对比哦。</p>
                </div>
                <button 
                    onClick={() => setFeedback(null)}
                    className="w-full bg-red-100 text-red-700 py-3 rounded-xl font-bold hover:bg-red-200 transition"
                >
                    重试
                </button>
            </div>
        )}

    </div>
  );
};
