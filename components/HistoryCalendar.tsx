import React, { useState, useMemo } from 'react';
import type { SavedWorkout } from '../types';
import { XIcon } from './icons/Icons';

interface HistoryCalendarProps {
  isOpen: boolean;
  onClose: () => void;
  savedWorkouts: SavedWorkout[];
  t: (key: string) => string;
  language: string;
}

const formatTime = (timeInSeconds: number): string => {
  const minutes = Math.floor(timeInSeconds / 60).toString().padStart(2, '0');
  const seconds = (timeInSeconds % 60).toString().padStart(2, '0');
  return `${minutes}:${seconds}`;
};

export const HistoryCalendar: React.FC<HistoryCalendarProps> = ({ isOpen, onClose, savedWorkouts, t, language }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [expandedWorkouts, setExpandedWorkouts] = useState<Set<number>>(new Set());

  const workoutsByDate = useMemo(() => {
    const map = new Map<string, SavedWorkout[]>();
    savedWorkouts.forEach(workout => {
      const dateKey = new Date(workout.date).toISOString().split('T')[0];
      if (!map.has(dateKey)) {
        map.set(dateKey, []);
      }
      map.get(dateKey)!.push(workout);
    });
    return map;
  }, [savedWorkouts]);

  if (!isOpen) return null;
  
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const changeMonth = (delta: number) => {
    setCurrentDate(prev => {
        const newDate = new Date(prev);
        newDate.setMonth(newDate.getMonth() + delta);
        return newDate;
    });
    setSelectedDate(null);
  };
  
  const selectedWorkouts = selectedDate ? workoutsByDate.get(selectedDate.toISOString().split('T')[0]) || [] : [];

  return (
    <div className="fixed inset-0 bg-gray-900 z-50 flex flex-col font-sans">
      {/* Безопасная область сверху для Android/iOS */}
      <div className="safe-area-inset-top bg-gray-900 w-full"></div>
      
      <div className="flex flex-col flex-1 p-4 overflow-hidden">
      <div className="flex justify-between items-center mb-4 flex-shrink-0">
        <h2 className="text-2xl font-bold text-white">{t('workoutHistory')}</h2>
        <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
          <XIcon />
        </button>
      </div>
      
      <div className="bg-gray-800 rounded-lg p-4 flex-shrink-0">
        <div className="flex justify-between items-center mb-4">
          <button onClick={() => changeMonth(-1)} className="font-bold text-2xl p-2">&lt;</button>
          <div className="text-xl font-bold">{currentDate.toLocaleString(language === 'ru' ? 'ru-RU' : language === 'es' ? 'es-ES' : 'en-US', { month: 'long', year: 'numeric' })}</div>
          <button onClick={() => changeMonth(1)} className="font-bold text-2xl p-2">&gt;</button>
        </div>
        <div className="grid grid-cols-7 gap-1 text-center text-xs text-gray-400 mb-2">
            {(() => {
              const weekDays = t('weekDays');
              const days = Array.isArray(weekDays) ? weekDays : ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
              return days.map((day, idx) => <div key={idx}>{day}</div>);
            })()}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {Array.from({ length: firstDayOfMonth }).map((_, i) => <div key={`empty-${i}`} />)}
          {Array.from({ length: daysInMonth }).map((_, day) => {
            const date = new Date(year, month, day + 1);
            const dateKey = date.toISOString().split('T')[0];
            const hasWorkout = workoutsByDate.has(dateKey);
            const isSelected = selectedDate?.toDateString() === date.toDateString();
            return (
              <div key={day} className="relative">
                <button
                  onClick={() => setSelectedDate(date)}
                  className={`w-full aspect-square rounded-full flex items-center justify-center transition-colors ${isSelected ? 'bg-green-500 text-white' : 'hover:bg-gray-700'}`}
                >
                  {day + 1}
                </button>
                {hasWorkout && <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-green-400 rounded-full" />}
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex-grow mt-4 overflow-y-auto">
        {selectedWorkouts.length > 0 ? (
          <div className="space-y-4">
            {selectedWorkouts.map(workout => {
              const isExpanded = expandedWorkouts.has(workout.id);
              const toggleExpanded = () => {
                const newSet = new Set(expandedWorkouts);
                if (isExpanded) {
                  newSet.delete(workout.id);
                } else {
                  newSet.add(workout.id);
                }
                setExpandedWorkouts(newSet);
              };

              return (
                <div key={workout.id} className="bg-gray-800 rounded-lg p-4">
                  <h3 className="text-xl font-bold text-green-400">{workout.name}</h3>
                  {workout.comment && <p className="text-gray-400 italic mt-1 mb-3">"{workout.comment}"</p>}
                  
                  <button
                    onClick={toggleExpanded}
                    className="w-full text-left text-sm text-gray-400 hover:text-white transition-colors flex items-center justify-between py-2 border-t border-gray-700 mt-3"
                  >
                    <span>{isExpanded ? t('collapse') : t('expand')} {t('timeIndicators')}</span>
                    <span className="text-lg">{isExpanded ? '▲' : '▼'}</span>
                  </button>

                  {isExpanded && (
                    <>
                      <div className="text-sm space-y-2 border-t border-gray-700 pt-3 mt-3">
                        <div className="flex justify-between"><span className="text-gray-400">{t('totalWorkoutTime')}</span> <span className="font-mono">{formatTime(workout.totalWorkoutTime)}</span></div>
                        <div className="flex justify-between"><span className="text-gray-400">{t('setTime')}</span> <span className="font-mono">{formatTime(workout.totalSetTime)}</span></div>
                      </div>
                      <div className="mt-2 pt-2 border-t border-gray-700">
                        {workout.sets.map((set, index) => (
                          <div key={index} className="py-1 border-b border-gray-700/50 last:border-b-0">
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-300">{t('set')} {index + 1}</span>
                              <span className="font-mono text-white">{formatTime(set.duration)}</span>
                            </div>
                            {index < workout.sets.length - 1 && workout.restDuration > 0 && (
                              <div className="flex justify-between text-xs pl-4">
                                <span className="text-gray-500">{t('restTime')}</span>
                                <span className="font-mono text-gray-500">{formatTime(workout.restDuration)}</span>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        ) : selectedDate && (
          <p className="text-center text-gray-500 mt-8">No workouts recorded on this day.</p>
        )}
      </div>
      </div>
    </div>
  );
};