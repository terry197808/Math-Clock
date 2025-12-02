
import React, { useState, useEffect, useRef } from 'react';
import { ClockFace } from './components/ClockFace';
import { ControlPanel } from './components/ControlPanel';
import { Quiz } from './components/Quiz';
import { TimeCalculator } from './components/TimeCalculator';
import { ClassroomActivity } from './components/ClassroomActivity';
import { Statistics } from './components/Statistics';
import { QuizQuestion, TimeMode } from './types';
import { Clock, Sun, Moon, Calculator, Users, Brain, MousePointerClick, EyeOff, PieChart } from 'lucide-react';

// Start at 8:00 AM
const INITIAL_MINUTES = 8 * 60;

const App: React.FC = () => {
  // Main State: Total minutes since "beginning of time"
  // Can be float during dragging
  const [totalMinutes, setTotalMinutes] = useState(INITIAL_MINUTES);
  const [isAnimating, setIsAnimating] = useState(false);
  const [mode, setMode] = useState<TimeMode>(TimeMode.Learning);
  const [currentQuiz, setCurrentQuiz] = useState<QuizQuestion | null>(null);

  // Animation Loop
  const requestRef = useRef<number>();
  
  const animate = () => {
    setTotalMinutes(prev => prev + 1); // 1 minute per frame tick (fast forward)
    requestRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    if (isAnimating) {
      requestRef.current = requestAnimationFrame(animate);
    } else {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    }
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [isAnimating]);

  // Handlers
  const handleAddMinutes = (mins: number) => {
    setTotalMinutes(prev => Math.max(0, prev + mins));
    setIsAnimating(false);
  };

  const handleTimeChange = (newMinutes: number) => {
    // Prevent negative time
    setTotalMinutes(Math.max(0, newMinutes));
    setIsAnimating(false); // Stop auto-animation if user interacts
  };

  const handleReset = () => {
    setTotalMinutes(INITIAL_MINUTES);
    setIsAnimating(false);
    // Don't reset mode here, just time
  };

  // Derived values for display (Use Floor for digital display)
  const displayTotalMinutes = Math.floor(totalMinutes);
  const daysPassed = Math.floor(displayTotalMinutes / (24 * 60));
  const minutesInDay = displayTotalMinutes % (24 * 60);
  const hours24 = Math.floor(minutesInDay / 60);
  const minutes = minutesInDay % 60;
  
  const hours12 = hours24 % 12 || 12; // 0 -> 12
  const ampm = hours24 < 12 ? 'AM' : 'PM';
  const isDaytime = hours24 >= 6 && hours24 < 18;

  const pad = (n: number) => n.toString().padStart(2, '0');

  // Quiz Handlers
  const startQuiz = (q: QuizQuestion) => {
    setCurrentQuiz(q);
    setIsAnimating(false);
    setTotalMinutes(Math.floor(Math.random() * 24 * 60)); 
  };

  const endQuiz = () => {
    setCurrentQuiz(null);
  };

  const checkAnswer = (strictMode: boolean) => {
    if (!currentQuiz) return { correct: false, currentH: 0, currentM: 0 };
    
    const targetH = currentQuiz.targetHour;
    const targetM = currentQuiz.targetMinute;

    let isMatch = false;

    if (strictMode) {
      // Hard mode: Check exact 24h hour match
      isMatch = hours24 === targetH && minutes === targetM;
    } else {
      // Easy mode: Check 12h position match (ignore AM/PM)
      isMatch = (hours24 % 12) === (targetH % 12) && minutes === targetM;
    }

    return {
      correct: isMatch,
      currentH: hours24,
      currentM: minutes
    };
  };

  // Mode Tabs
  const renderTabs = () => (
    <div className="flex bg-slate-100 p-1 rounded-xl mb-6 overflow-x-auto no-scrollbar">
      <button
        onClick={() => setMode(TimeMode.Learning)}
        className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-sm font-bold transition whitespace-nowrap ${mode === TimeMode.Learning ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
      >
        <MousePointerClick size={16} /> 自由探索
      </button>
      <button
        onClick={() => setMode(TimeMode.Quiz)}
        className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-sm font-bold transition whitespace-nowrap ${mode === TimeMode.Quiz ? 'bg-white text-violet-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
      >
        <Brain size={16} /> 闯关挑战
      </button>
      <button
        onClick={() => setMode(TimeMode.Calculation)}
        className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-sm font-bold transition whitespace-nowrap ${mode === TimeMode.Calculation ? 'bg-white text-amber-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
      >
        <Calculator size={16} /> 时间计算
      </button>
      <button
        onClick={() => setMode(TimeMode.Activity)}
        className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-sm font-bold transition whitespace-nowrap ${mode === TimeMode.Activity ? 'bg-white text-pink-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
      >
        <Users size={16} /> 小组活动
      </button>
      <button
        onClick={() => setMode(TimeMode.Statistics)}
        className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-sm font-bold transition whitespace-nowrap ${mode === TimeMode.Statistics ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
      >
        <PieChart size={16} /> 学习统计
      </button>
    </div>
  );

  return (
    <div className={`flex flex-col md:flex-row h-screen w-full transition-colors duration-1000 ${isDaytime ? 'bg-sky-50' : 'bg-slate-900'}`}>
      
      {/* Left Panel: Visuals */}
      <div className="flex-1 flex flex-col items-center justify-center p-4 md:p-8 relative overflow-hidden select-none">
        
        {/* Sky/Ambience Background Effects */}
        <div className={`absolute top-10 left-10 transition-all duration-1000 ${isDaytime ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
             <Sun size={64} className="text-yellow-400 animate-pulse" />
        </div>
        <div className={`absolute top-10 right-10 transition-all duration-1000 ${!isDaytime ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
             <Moon size={64} className="text-slate-200" />
        </div>

        {/* Title */}
        <header className="mb-8 text-center z-10 pointer-events-none">
            <h1 className={`text-3xl md:text-4xl font-bold mb-2 flex items-center justify-center gap-3 ${isDaytime ? 'text-sky-900' : 'text-sky-100'}`}>
                <Clock className={isDaytime ? 'text-sky-600' : 'text-sky-300'} size={40} />
                数学时间探险
            </h1>
            <p className={`text-lg ${isDaytime ? 'text-sky-700' : 'text-sky-300'}`}>
                第 <span className="font-mono font-bold text-2xl mx-1">{daysPassed + 1}</span> 天
            </p>
        </header>

        {/* The Clock */}
        <div className="mb-10 w-full flex justify-center z-10">
           <ClockFace 
              totalMinutes={totalMinutes} 
              onTimeChange={handleTimeChange}
              isInteractive={true}
           />
        </div>

        {/* Digital Display Box */}
        {mode === TimeMode.Quiz ? (
             <div className="bg-white/90 backdrop-blur-sm p-6 rounded-2xl shadow-xl border border-violet-200 z-10 w-64 text-center">
                 <div className="text-violet-600 flex flex-col items-center gap-2">
                     <EyeOff size={32} />
                     <span className="font-bold">电子钟已隐藏</span>
                     <span className="text-xs text-slate-500">请直接观察钟面作答哦</span>
                 </div>
             </div>
        ) : (
            <div className="bg-white/90 backdrop-blur-sm p-6 rounded-2xl shadow-xl flex items-center justify-center gap-8 border border-white/50 z-10 pointer-events-none">
                <div className="text-center">
                    <div className="text-xs text-slate-500 uppercase font-bold tracking-wider mb-1">12小时制</div>
                    <div className="font-mono text-4xl font-bold text-slate-800 tracking-widest">
                        {hours12}:{pad(minutes)} <span className="text-lg text-slate-500">{ampm}</span>
                    </div>
                </div>
                <div className="w-px h-12 bg-slate-300"></div>
                <div className="text-center">
                    <div className="text-xs text-slate-500 uppercase font-bold tracking-wider mb-1">24小时制</div>
                    <div className="font-mono text-3xl font-bold text-indigo-600 tracking-widest">
                        {pad(hours24)}:{pad(minutes)}
                    </div>
                </div>
            </div>
        )}
      </div>

      {/* Right Panel: Controls & Interaction */}
      <div className={`w-full md:w-[450px] flex flex-col z-20 shadow-2xl transition-colors duration-1000 ${isDaytime ? 'bg-white' : 'bg-slate-800 border-l border-slate-700'}`}>
        
        <div className="p-6 h-full overflow-y-auto">
            <div className="max-w-md mx-auto min-h-full flex flex-col">
                
                {renderTabs()}

                <div className="flex-1">
                    {mode === TimeMode.Learning && (
                        <div className="space-y-6">
                            <ControlPanel 
                                onAddMinutes={handleAddMinutes}
                                onSetSpecific={(m) => setTotalMinutes(m)}
                                isAnimating={isAnimating}
                                toggleAnimation={() => setIsAnimating(!isAnimating)}
                                reset={handleReset}
                                currentTotalMinutes={totalMinutes}
                            />
                            <div className={`p-5 rounded-2xl border ${isDaytime ? 'bg-amber-50 border-amber-100 text-amber-900' : 'bg-slate-700 border-slate-600 text-slate-200'}`}>
                                <h3 className="font-bold mb-3 flex items-center gap-2">
                                    💡 观察重点
                                </h3>
                                <ul className="space-y-3 text-sm leading-relaxed">
                                    <li className="flex gap-2">
                                        <span className="font-bold text-red-500">红色时针</span>: 
                                        它又短又粗，走得最慢。
                                    </li>
                                    <li className="flex gap-2">
                                        <span className="font-bold text-blue-500">蓝色分针</span>: 
                                        它细细长长的，走得比较快。
                                    </li>
                                </ul>
                            </div>
                        </div>
                    )}

                    {mode === TimeMode.Quiz && (
                        <Quiz 
                            isActive={currentQuiz !== null} 
                            onStartQuiz={startQuiz} 
                            onCheckAnswer={checkAnswer}
                            onEndQuiz={endQuiz}
                        />
                    )}

                    {mode === TimeMode.Calculation && (
                        <TimeCalculator 
                            onSetTime={(m) => {
                                setTotalMinutes(m);
                                setIsAnimating(false);
                            }} 
                        />
                    )}

                    {mode === TimeMode.Activity && (
                        <ClassroomActivity />
                    )}

                    {mode === TimeMode.Statistics && (
                        <Statistics />
                    )}
                </div>
            </div>
        </div>
      </div>

    </div>
  );
};

export default App;
