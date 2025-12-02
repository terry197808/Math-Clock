
export enum TimeMode {
  Learning = 'LEARNING',
  Quiz = 'QUIZ',
  Calculation = 'CALCULATION',
  Activity = 'ACTIVITY',
  Statistics = 'STATISTICS'
}

export type QuizDifficulty = 'easy' | 'hard';

export interface QuizQuestion {
  question: string;
  targetHour: number;
  targetMinute: number;
  hint: string;
}

export interface TimeState {
  totalMinutes: number; // Minutes from 00:00 on Day 1
}

export interface QuizResult {
  id: string;
  timestamp: number;
  difficulty: QuizDifficulty;
  question: string;
  isCorrect: boolean;
  targetTimeStr: string;
  userTimeStr: string;
}
