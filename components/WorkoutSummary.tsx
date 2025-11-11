import React from 'react';
import type { Set } from '../types';

interface WorkoutSummaryProps {
  sets: Set[];
  totalWorkoutTime: number;
  restDuration: number;
  t: (key: string) => string;
  onReset: () => void;
  onSaveRequest: () => void;
}

const formatTime = (timeInSeconds: number): string => {
  const minutes = Math.floor(timeInSeconds / 60).toString().padStart(2, '0');
  const seconds = (timeInSeconds % 60).toString().padStart(2, '0');
  return `${minutes}:${seconds}`;
};

export const WorkoutSummary: React.FC<WorkoutSummaryProps> = ({ sets, totalWorkoutTime, restDuration, t, onReset, onSaveRequest }) => {
  const totalSetTime = sets.reduce((acc, set) => acc + set.duration, 0);

  return (
    <div className="flex flex-col h-screen w-screen bg-gray-900 text-white font-sans">
      {/* Безопасная область сверху для Android/iOS */}
      <div className="safe-area-inset-top bg-gray-900 w-full"></div>
      
      <div className="flex flex-col flex-1 p-4 items-center justify-center overflow-hidden">
      <div className="bg-gray-800 p-6 rounded-lg shadow-xl w-full max-w-md text-center">
        <h2 className="text-3xl font-bold text-green-400 mb-4">{t('workoutComplete')}</h2>
        <p className="text-gray-400 mb-6">{t('summaryOfSets')}</p>
        <div className="max-h-60 overflow-y-auto bg-gray-900 rounded-md p-2 mb-4 text-left space-y-1">
          {sets.map((set, index) => (
            <div key={index} className="border-b border-gray-700 pb-1 last:border-b-0">
              <div className="flex justify-between p-1">
                <span className="font-bold">{t('set')} {index + 1}</span>
                <span className="text-white font-mono">{formatTime(set.duration)}</span>
              </div>
              {index < sets.length - 1 && (
                <div className="flex justify-between px-1 pl-5">
                    <span className="text-gray-400 text-sm">{t('restTime')}</span>
                    <span className="text-gray-400 font-mono text-sm">{formatTime(restDuration)}</span>
                </div>
              )}
            </div>
          ))}
        </div>
        <div className="text-left text-lg space-y-2 border-t-2 border-green-400 pt-4 mt-4">
            <div className="flex justify-between font-semibold">
                <span className="text-gray-400">{t('setTime')}</span>
                <span className="font-mono">{formatTime(totalSetTime)}</span>
            </div>
            <div className="flex justify-between font-bold">
                <span className="text-gray-300">{t('totalWorkoutTime')}</span>
                <span className="font-mono">{formatTime(totalWorkoutTime)}</span>
            </div>
        </div>
        <div className="mt-8 flex flex-col sm:flex-row gap-4">
            <button
                onClick={onSaveRequest}
                className="w-full bg-blue-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-blue-500 transition-colors text-lg"
            >
                {t('saveWorkout')}
            </button>
            <button
                onClick={onReset}
                className="w-full bg-green-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-green-500 transition-colors text-lg"
            >
                {t('startNewWorkout')}
            </button>
        </div>
      </div>
      </div>
    </div>
  );
};