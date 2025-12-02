
import { QuizResult } from "../types";

const STORAGE_KEY = 'mathClock_quizHistory_v1';

export const saveQuizResult = (result: Omit<QuizResult, 'id' | 'timestamp'>) => {
  try {
    const history = getQuizHistory();
    const newRecord: QuizResult = {
      ...result,
      id: crypto.randomUUID(),
      timestamp: Date.now(),
    };
    
    // Keep only the last 100 records to prevent storage bloat
    const updatedHistory = [newRecord, ...history].slice(0, 100);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedHistory));
  } catch (error) {
    console.error("Failed to save quiz result", error);
  }
};

export const getQuizHistory = (): QuizResult[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error("Failed to load history", error);
    return [];
  }
};

export const clearQuizHistory = () => {
  localStorage.removeItem(STORAGE_KEY);
};

export const getStats = () => {
  const history = getQuizHistory();
  const total = history.length;
  if (total === 0) return null;

  const correct = history.filter(r => r.isCorrect).length;
  
  // Difficulty Breakdown
  const easyAttempts = history.filter(r => r.difficulty === 'easy');
  const hardAttempts = history.filter(r => r.difficulty === 'hard');

  const calcRate = (subset: QuizResult[]) => {
    if (subset.length === 0) return 0;
    return Math.round((subset.filter(r => r.isCorrect).length / subset.length) * 100);
  };

  return {
    total,
    correct,
    accuracy: Math.round((correct / total) * 100),
    easy: {
      total: easyAttempts.length,
      accuracy: calcRate(easyAttempts)
    },
    hard: {
      total: hardAttempts.length,
      accuracy: calcRate(hardAttempts)
    }
  };
};
