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
    <div className="flex bg-slate-100 p-1 rounded-xl w-full overflow-x-auto no-scrollbar shrink-0">
      <button
        onClick={() => setMode(TimeMode.Learning)}
        className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs md:text-sm font-bold transition whitespace-nowrap ${mode === TimeMode.Learning ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
      >
        <MousePointerClick size={14} className="md:w-4 md:h-4" /> 自由探索
      </button>
      <button
        onClick={() => setMode(TimeMode.Quiz)}
        className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs md:text-sm font-bold transition whitespace-nowrap ${mode === TimeMode.Quiz ? 'bg-white text-violet-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
      >
        <Brain size={14} className="md:w-4 md:h-4" /> 闯关
      </button>
      <button
        onClick={() => setMode(TimeMode.Calculation)}
        className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs md:text-sm font-bold transition whitespace-nowrap ${mode === TimeMode.Calculation ? 'bg-white text-amber-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
      >
        <Calculator size={14} className="md:w-4 md:h-4" /> 计算
      </button>
      <button
        onClick={() => setMode(TimeMode.Activity)}
        className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs md:text-sm font-bold transition whitespace-nowrap ${mode === TimeMode.Activity ? 'bg-white text-pink-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
      >
        <Users size={14} className="md:w-4 md:h-4" /> 活动
      </button>
      <button
        onClick={() => setMode(TimeMode.Statistics)}
        className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs md:text-sm font-bold transition whitespace-nowrap ${mode === TimeMode.Statistics ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
      >
        <PieChart size={14} className="md:w-4 md:h-4" /> 统计
      </button>
    </div>
  );

  return (
    <div className={`flex flex-col md:flex-row h-screen w-full overflow-hidden transition-colors duration-1000 ${isDaytime ? 'bg-sky-50' : 'bg-slate-900'}`}>
      
      {/* 
          TOP / LEFT PANEL: Visuals & Clock 
          - Mobile: Top 45% height
          - Desktop: Left Flex-1 height 100%
      */}
      <div className="flex-shrink-0 h-[45vh] md:h-full md:flex-1 flex flex-col items-center justify-center relative select-none p-2 overflow-hidden">
        
        {/* Sky/Ambience Background Effects */}
        <div className={`absolute top-4 left-4 md:top-10 md:left-10 transition-all duration-1000 ${isDaytime ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
             <Sun size={40} className="md:w-16 md:h-16 text-yellow-400 animate-pulse" />
        </div>
        <div className={`absolute top-4 right-4 md:top-10 md:right-10 transition-all duration-1000 ${!isDaytime ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
             <Moon size={40} className="md:w-16 md:h-16 text-slate-200" />
        </div>

        {/* Title */}
        <header className="mb-2 md:mb-8 text-center z-10 pointer-events-none shrink-0">
            <h1 className={`text-xl md:text-4xl font-bold mb-1 flex items-center justify-center gap-2 ${isDaytime ? 'text-sky-900' : 'text-sky-100'}`}>
                <Clock className={`${isDaytime ? 'text-sky-600' : 'text-sky-300'} md:w-8 md:h-8`} size={24} />
                数学时间探险
            </h1>
            <p className={`text-xs md:text-lg ${isDaytime ? 'text-sky-700' : 'text-sky-300'}`}>
                第 <span className="font-mono font-bold text-sm md:text-xl mx-1">{daysPassed + 1}</span> 天
            </p>
        </header>

        {/* The Clock - Constrained to prevent overflow */}
        <div className="flex-1 w-full flex items-center justify-center min-h-0 z-10 p-2">
           <div className="h-full aspect-square max-h-[300px] md:max-h-[500px] w-auto">
                <ClockFace 
                    totalMinutes={totalMinutes} 
                    onTimeChange={handleTimeChange}
                    isInteractive={true}
                />
           </div>
        </div>

        {/* Digital Display Box */}
        <div className="shrink-0 mb-2 md:mb-10 z-10">
            {mode === TimeMode.Quiz ? (
                <div className="bg-white/90 backdrop-blur-sm px-4 py-2 rounded-xl shadow-lg border border-violet-200 text-center">
                    <div className="text-violet-600 flex items-center gap-2 text-sm md:text-base">
                        <EyeOff size={16} />
                        <span className="font-bold">电子钟已隐藏</span>
                    </div>
                </div>
            ) : (
                <div className="bg-white/90 backdrop-blur-sm px-4 py-2 md:px-6 md:py-4 rounded-xl shadow-lg flex items-center justify-center gap-4 border border-white/50">
                    <div className="text-center">
                        <div className="text-[10px] text-slate-500 uppercase font-bold tracking-wider mb-0.5">12小时制</div>
                        <div className="font-mono text-xl md:text-4xl font-bold text-slate-800 tracking-widest">
                            {hours12}:{pad(minutes)} <span className="text-sm md:text-lg text-slate-500">{ampm}</span>
                        </div>
                    </div>
                    <div className="w-px h-8 md:h-12 bg-slate-300"></div>
                    <div className="text-center">
                        <div className="text-[10px] text-slate-500 uppercase font-bold tracking-wider mb-0.5">24小时制</div>
                        <div className="font-mono text-lg md:text-3xl font-bold text-indigo-600 tracking-widest">
                            {pad(hours24)}:{pad(minutes)}
                        </div>
                    </div>
                </div>
            )}
        </div>
      </div>

      {/* 
          BOTTOM / RIGHT PANEL: Controls
          - Mobile: Bottom 55% height, Rounded top corners, Shadow
          - Desktop: Right side 450px, Full height
      */}
      <div className={`flex-1 md:w-[450px] md:flex-none h-[55vh] md:h-full z-20 shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.3)] rounded-t-[2rem] md:rounded-none flex flex-col overflow-hidden transition-colors duration-1000 ${isDaytime ? 'bg-white' : 'bg-slate-800 border-l border-slate-700'}`}>
        
        {/* Fixed Header with Tabs */}
        <div className="flex-none p-2 pb-0 md:p-6 md:pb-6 bg-inherit mt-2 md:mt-0">
             {renderTabs()}
        </div>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto p-2 pt-2 md:p-6 md:pt-0 custom-scrollbar">
            <div className="max-w-md mx-auto h-full">
                {mode === TimeMode.Learning && (
                    <div className="space-y-4 md:space-y-6 pb-6">
                        <ControlPanel 
                            onAddMinutes={handleAddMinutes}
                            onSetSpecific={(m) => setTotalMinutes(m)}
                            isAnimating={isAnimating}
                            toggleAnimation={() => setIsAnimating(!isAnimating)}
                            reset={handleReset}
                            currentTotalMinutes={totalMinutes}
                        />
                    </div>
                )}

                {mode === TimeMode.Quiz && (
                    <div className="pb-6">
                        <Quiz 
                            isActive={currentQuiz !== null} 
                            onStartQuiz={startQuiz} 
                            onCheckAnswer={checkAnswer}
                            onEndQuiz={endQuiz}
                        />
                    </div>
                )}

                {mode === TimeMode.Calculation && (
                    <div className="pb-6">
                        <TimeCalculator 
                            onSetTime={(m) => {
                                setTotalMinutes(m);
                                setIsAnimating(false);
                            }} 
                        />
                    </div>
                )}

                {mode === TimeMode.Activity && (
                    <div className="pb-6">
                        <ClassroomActivity />
                    </div>
                )}

                {mode === TimeMode.Statistics && (
                    <div className="h-full pb-6">
                        <Statistics />
                    </div>
                )}
            </div>
        </div>
      </div>

    </div>
  );
};

export default App;