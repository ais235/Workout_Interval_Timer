import React from 'react';
import type { Set } from '../types';

interface SetHistoryProps {
  sets: Set[];
  t: (key: string) => string;
}

const formatSeconds = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins > 0 ? `${mins}m ` : ''}${secs}s`;
};


export const SetHistory: React.FC<SetHistoryProps> = ({ sets, t }) => {
  if (sets.length === 0) {
    return <div className="text-center text-gray-400 mt-8">{t('noSetsYet')}</div>;
  }

  return (
    <div className="flex flex-col gap-2 overflow-y-auto h-full pb-16">
        <h3 className="text-lg font-semibold text-gray-400 mb-2 sticky top-0 bg-gray-800 py-2">{t('completedSets')}: {sets.length}</h3>
        {sets.map((set, index) => (
            <div key={index} className="bg-gray-900 rounded-md px-4 py-2 flex justify-between items-center">
                <span className="font-bold text-gray-300">{t('set')} {index + 1}</span>
                <span className="text-gray-400 font-mono">{formatSeconds(set.duration)}</span>
            </div>
        )).reverse()}
    </div>
  );
};