
import React, { useState } from 'react';
import { generateTimeQuiz } from '../services/geminiService';
import { saveQuizResult } from '../services/statsService';
import { QuizQuestion, QuizDifficulty } from '../types';
import { Brain, CheckCircle, XCircle, Loader2, Gauge } from 'lucide-react';

interface QuizProps {
  onStartQuiz: (target: QuizQuestion) => void;
  onCheckAnswer: (strict: boolean) => { correct: boolean; currentH: number; currentM: number };
  isActive: boolean;
  onEndQuiz: () => void;
}

export const Quiz: React.FC<QuizProps> = ({ onStartQuiz, onCheckAnswer, isActive, onEndQuiz }) => {
  const [loading, setLoading] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState<QuizQuestion | null>(null);
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const [message, setMessage] = useState('');
  const [difficulty, setDifficulty] = useState<QuizDifficulty>('easy');

  const handleStart = async () => {
    setLoading(true);
    setFeedback(null);
    setMessage('');
    try {
      const q = await generateTimeQuiz(difficulty);
      setCurrentQuestion(q);
      onStartQuiz(q);
    } catch (e) {
      console.error(e);
      setMessage("AI老师好像睡着了，请重试一下。");
    } finally {
      setLoading(false);
    }
  };

  const check = () => {
    if (!currentQuestion) return;
    // For 'hard' mode, we use strict checking (24h matching)
    const strict = difficulty === 'hard';
    const { correct, currentH, currentM } = onCheckAnswer(strict);
    
    // Format times for record
    const targetTimeStr = `${currentQuestion.targetHour.toString().padStart(2, '0')}:${currentQuestion.targetMinute.toString().padStart(2, '0')}`;
    const userTimeStr = `${currentH.toString().padStart(2, '0')}:${currentM.toString().padStart(2, '0')}`;

    // Save Result
    saveQuizResult({
      difficulty,
      question: currentQuestion.question,
      isCorrect: correct,
      targetTimeStr,
      userTimeStr
    });

    if (correct) {
      setFeedback('correct');
      setMessage("太棒了！你答对了！🎉");
    } else {
      setFeedback('incorrect');
      setMessage(`不对哦，现在是 ${userTimeStr}。${currentQuestion.hint}`);
    }
  };

  if (!isActive) {
    return (
      <div className="space-y-4">
        <div className="bg-white p-4 rounded-xl border border-violet-100 shadow-sm">
           <div className="flex items-center gap-2 mb-3 text-violet-800 font-bold">
              <Gauge size={20} /> 选择难度
           </div>
           <div className="flex gap-2">
              <button 
                onClick={() => setDifficulty('easy')}
                className={`flex-1 py-2 rounded-lg text-sm font-bold transition ${difficulty === 'easy' ? 'bg-violet-100 text-violet-700 border-2 border-violet-200' : 'bg-slate-50 text-slate-500 border border-slate-100'}`}
              >
                简单 (12小时)
              </button>
              <button 
                onClick={() => setDifficulty('hard')}
                className={`flex-1 py-2 rounded-lg text-sm font-bold transition ${difficulty === 'hard' ? 'bg-fuchsia-100 text-fuchsia-700 border-2 border-fuchsia-200' : 'bg-slate-50 text-slate-500 border border-slate-100'}`}
              >
                困难 (24小时)
              </button>
           </div>
           <p className="text-xs text-slate-500 mt-2 ml-1">
             {difficulty === 'easy' ? '整点或半点练习，忽略上午下午。' : '精确到分钟，需要区分上午和下午哦！'}
           </p>
        </div>

        <button 
          onClick={handleStart}
          className="w-full bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white font-bold py-4 px-6 rounded-2xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition flex items-center justify-center gap-2"
        >
          <Brain size={24} />
          {difficulty === 'easy' ? '开始简单挑战' : '开始高手挑战'}
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-2xl shadow-xl border-2 border-violet-100 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-violet-500 to-fuchsia-500"></div>
        
        {loading ? (
            <div className="flex flex-col items-center justify-center py-8 text-violet-600">
                <Loader2 className="animate-spin mb-2" size={32} />
                <p>AI 老师正在出题中...</p>
            </div>
        ) : (
            <div className="space-y-4">
                <div className="flex justify-between items-start">
                    <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                        {difficulty === 'hard' && <span className="text-xs bg-fuchsia-100 text-fuchsia-700 px-2 py-1 rounded">高手模式</span>}
                        挑战时间!
                    </h3>
                    <button onClick={onEndQuiz} className="text-sm text-slate-400 hover:text-slate-600">退出挑战</button>
                </div>
                
                <p className="text-xl font-medium text-violet-800">
                    {currentQuestion?.question}
                </p>

                {feedback === 'correct' && (
                    <div className="bg-green-50 text-green-700 p-3 rounded-lg flex items-center gap-2">
                        <CheckCircle className="shrink-0" />
                        <span>{message}</span>
                    </div>
                )}

                {feedback === 'incorrect' && (
                    <div className="bg-red-50 text-red-700 p-3 rounded-lg flex items-center gap-2">
                        <XCircle className="shrink-0" />
                        <span>{message}</span>
                    </div>
                )}

                <div className="flex gap-2 mt-4">
                    {feedback !== 'correct' ? (
                        <button 
                            onClick={check}
                            className="flex-1 bg-violet-600 text-white py-3 rounded-xl font-bold hover:bg-violet-700 transition"
                        >
                            我拨好了，检查答案
                        </button>
                    ) : (
                        <button 
                            onClick={handleStart}
                            className="flex-1 bg-green-500 text-white py-3 rounded-xl font-bold hover:bg-green-600 transition"
                        >
                            下一题
                        </button>
                    )}
                </div>
            </div>
        )}
    </div>
  );
};
