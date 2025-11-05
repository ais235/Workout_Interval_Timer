import React, { useState, useEffect, useCallback, useRef } from 'react';
import { SettingsIcon, HistoryIcon, XIcon, CalendarIcon } from './components/icons/Icons';
import { SetHistory } from './components/SetHistory';
import { SettingsModal } from './components/SettingsModal';
import { WorkoutSummary } from './components/WorkoutSummary';
import { SaveWorkoutModal } from './components/SaveWorkoutModal';
import { HistoryCalendar } from './components/HistoryCalendar';
import { useWakeLock } from './hooks/useWakeLock';
import { useAudio } from './hooks/useAudio';
import { useSpeech } from './hooks/useSpeech';
import { BEEP_SOUND_URL } from './constants';
import type { WorkoutPhase, Set, SavedWorkout, AppSettings } from './types';
import { PHASE } from './types';

const locales = {
  en: 'English',
  es: 'Español',
  ru: 'Русский',
};

const translations = {
  en: {
    workoutTimer: 'Workout Timer',
    start: 'START',
    finishSet: 'FINISH SET',
    skipRest: 'SKIP REST',
    tapToBegin: 'Tap to begin your first set',
    set: 'Set',
    resting: 'Resting...',
    endAndReset: 'End & Reset Workout',
    settings: 'Settings',
    restTime: 'Rest Time',
    minutes: 'Minutes',
    seconds: 'Seconds',
    saveSettings: 'Save Settings',
    language: 'Language',
    completedSets: 'Completed Sets',
    noSetsYet: 'No sets completed yet.',
    workoutComplete: 'Workout Complete!',
    summaryOfSets: 'Summary of your sets:',
    totalWorkoutTime: 'Total Workout Time',
    setTime: 'Set Time',
    startNewWorkout: 'Start New Workout',
    history: 'History',
    close: 'Close',
    saveWorkout: 'Save Workout',
    workoutName: 'Workout Name',
    customName: 'Custom Name',
    commentOptional: 'Comment (Optional)',
    save: 'Save',
    cancel: 'Cancel',
    workoutHistory: 'Workout History',
    targetSets: 'Target Sets',
    infinite: 'Infinite',
    endOfRestSound: 'End of Rest Sound',
    beep: 'Beep',
    voice: 'Voice',
    predefinedNames: {
      legs: 'Legs', arms: 'Arms', back: 'Back', chest: 'Chest', 
      shoulders: 'Shoulders', core: 'Core', cardio: 'Cardio', other: 'Other'
    },
  },
  es: {
    workoutTimer: 'Temporizador de Entrenamiento',
    start: 'EMPEZAR',
    finishSet: 'TERMINAR SERIE',
    skipRest: 'SALTAR DESCANSO',
    tapToBegin: 'Toca para empezar la primera serie',
    set: 'Serie',
    resting: 'Descansando...',
    endAndReset: 'Finalizar y Reiniciar',
    settings: 'Ajustes',
    restTime: 'Tiempo de Descanso',
    minutes: 'Minutos',
    seconds: 'Segundos',
    saveSettings: 'Guardar Ajustes',
    language: 'Idioma',
    completedSets: 'Series Completadas',
    noSetsYet: 'Aún no has completado ninguna serie.',
    workoutComplete: '¡Entrenamiento Completo!',
    summaryOfSets: 'Resumen de tus series:',
    totalWorkoutTime: 'Tiempo Total de Entrenamiento',
    setTime: 'Tiempo de Series',
    startNewWorkout: 'Empezar Nuevo Entrenamiento',
    history: 'Historial',
    close: 'Cerrar',
    saveWorkout: 'Guardar Entrenamiento',
    workoutName: 'Nombre del Entrenamiento',
    customName: 'Nombre Personalizado',
    commentOptional: 'Comentario (Opcional)',
    save: 'Guardar',
    cancel: 'Cancelar',
    workoutHistory: 'Historial de Entrenamientos',
    targetSets: 'Series Objetivo',
    infinite: 'Infinito',
    endOfRestSound: 'Sonido de Fin de Descanso',
    beep: 'Pitido',
    voice: 'Voz',
     predefinedNames: {
      legs: 'Piernas', arms: 'Brazos', back: 'Espalda', chest: 'Pecho', 
      shoulders: 'Hombros', core: 'Core', cardio: 'Cardio', other: 'Otro'
    },
  },
  ru: {
    workoutTimer: 'Таймер Тренировки',
    start: 'СТАРТ',
    finishSet: 'ЗАКОНЧИТЬ ПОДХОД',
    skipRest: 'ПРОПУСТИТЬ ОТДЫХ',
    tapToBegin: 'Нажмите, чтобы начать первый подход',
    set: 'Подход',
    resting: 'Отдых...',
    endAndReset: 'Завершить и Сбросить',
    settings: 'Настройки',
    restTime: 'Время Отдыха',
    minutes: 'Минуты',
    seconds: 'Секунды',
    saveSettings: 'Сохранить',
    language: 'Язык',
    completedSets: 'Выполнено подходов',
    noSetsYet: 'Вы еще не выполнили ни одного подхода.',
    workoutComplete: 'Тренировка Завершена!',
    summaryOfSets: 'Обзор ваших подходов:',
    totalWorkoutTime: 'Время всей тренировки',
    setTime: 'Время подходов',
    startNewWorkout: 'Начать новую тренировку',
    history: 'История',
    close: 'Закрыть',
    saveWorkout: 'Сохранить тренировку',
    workoutName: 'Название тренировки',
    customName: 'Своё название',
    commentOptional: 'Комментарий (необязательно)',
    save: 'Сохранить',
    cancel: 'Отмена',
    workoutHistory: 'История тренировок',
    targetSets: 'Целевое количество подходов',
    infinite: 'Бесконечно',
    endOfRestSound: 'Звук в конце отдыха',
    beep: 'Сигнал',
    voice: 'Голос',
    predefinedNames: {
      legs: 'Ноги', arms: 'Руки', back: 'Спина', chest: 'Грудь', 
      shoulders: 'Плечи', core: 'Кор', cardio: 'Кардио', other: 'Другое'
    },
  }
};

const formatTime = (timeInSeconds: number): string => {
  const minutes = Math.floor(timeInSeconds / 60).toString().padStart(2, '0');
  const seconds = (timeInSeconds % 60).toString().padStart(2, '0');
  return `${minutes}:${seconds}`;
};

const WORKOUT_HISTORY_KEY = 'workout_timer_history';
const WORKOUT_SETTINGS_KEY = 'workout_timer_settings';

type CompletedWorkout = Omit<SavedWorkout, 'id' | 'date' | 'name' | 'comment'>;

const defaultSettings: AppSettings = {
  restDuration: 60,
  targetSets: 0,
  endSound: 'beep'
};

export default function App() {
  const [phase, setPhase] = useState<WorkoutPhase>(PHASE.IDLE);
  const [sets, setSets] = useState<Set[]>([]);
  const [currentTime, setCurrentTime] = useState(0);
  const [settings, setSettings] = useState<AppSettings>(defaultSettings);
  const [showSettings, setShowSettings] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [language, setLanguage] = useState('en');
  const [savedWorkouts, setSavedWorkouts] = useState<SavedWorkout[]>([]);
  const [workoutStartTime, setWorkoutStartTime] = useState<number | null>(null);
  const [completedWorkout, setCompletedWorkout] = useState<CompletedWorkout | null>(null);

  const t = useCallback((key: string, options?: Record<string, string>) => {
      const translation = translations[language][key] || key;
      if (typeof translation === 'object' && translation !== null) {
          return key;
      }
      return translation;
  }, [language]);

  const workoutTimeRef = useRef(0);
  const intervalRef = useRef<number | null>(null);

  const { play: playBeep } = useAudio(BEEP_SOUND_URL);
  const { speak } = useSpeech();
  useWakeLock();

  useEffect(() => {
    try {
      const storedHistory = localStorage.getItem(WORKOUT_HISTORY_KEY);
      if (storedHistory) setSavedWorkouts(JSON.parse(storedHistory));

      const storedSettings = localStorage.getItem(WORKOUT_SETTINGS_KEY);
      if (storedSettings) {
        setSettings(prev => ({...prev, ...JSON.parse(storedSettings)}));
      }
    } catch (error) {
      console.error("Failed to load data from localStorage:", error);
    }
  }, []);

  useEffect(() => {
      localStorage.setItem(WORKOUT_SETTINGS_KEY, JSON.stringify(settings));
  }, [settings]);

  const stopTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (phase === PHASE.REST && currentTime <= 0) {
      if (settings.endSound === 'voice') {
        const nextSetText = `${t('set')} ${sets.length + 1}`;
        speak(nextSetText, language);
      } else {
        playBeep();
      }
      setPhase(PHASE.WORKOUT);
      setCurrentTime(0);
      workoutTimeRef.current = 0;
    }
  }, [currentTime, phase, playBeep, sets.length, settings.endSound, speak, t, language]);
  
  useEffect(() => {
    stopTimer();
    if (phase === PHASE.WORKOUT) {
      intervalRef.current = window.setInterval(() => {
        workoutTimeRef.current += 1;
        setCurrentTime(workoutTimeRef.current);
      }, 1000);
    } else if (phase === PHASE.REST) {
      intervalRef.current = window.setInterval(() => {
        setCurrentTime(prev => Math.max(0, prev - 1));
      }, 1000);
    }
    return () => stopTimer();
  }, [phase, stopTimer]);


  const handleMainAction = () => {
    if (phase === PHASE.IDLE) {
      setWorkoutStartTime(Date.now());
      setPhase(PHASE.WORKOUT);
    } else if (phase === PHASE.WORKOUT) {
      const newSet = { duration: workoutTimeRef.current > 0 ? workoutTimeRef.current : 1 };
      const updatedSets = [...sets, newSet];

      if (settings.targetSets > 0 && updatedSets.length >= settings.targetSets) {
        handleEndWorkout(updatedSets);
      } else {
        setSets(updatedSets);
        setPhase(PHASE.REST);
        setCurrentTime(settings.restDuration);
      }
    } else if (phase === PHASE.REST) {
       if (settings.endSound === 'voice') {
        const nextSetText = `${t('set')} ${sets.length + 1}`;
        speak(nextSetText, language);
      } else {
        playBeep();
      }
      setPhase(PHASE.WORKOUT);
      setCurrentTime(0);
      workoutTimeRef.current = 0;
    }
  };

  const handleEndWorkout = (finalSetsOverride?: Set[]) => {
    stopTimer();
    let finalSets = finalSetsOverride ? finalSetsOverride : [...sets];

    // Capture the last running set if workout is ended manually mid-set
    if (!finalSetsOverride && phase === PHASE.WORKOUT && workoutTimeRef.current > 0) {
      finalSets.push({ duration: workoutTimeRef.current });
    }

    const finalTotalWorkoutTime = workoutStartTime
      ? Math.round((Date.now() - workoutStartTime) / 1000)
      : 0;

    const finalTotalSetTime = finalSets.reduce((acc, set) => acc + set.duration, 0);

    setCompletedWorkout({
      sets: finalSets,
      totalWorkoutTime: finalTotalWorkoutTime,
      totalSetTime: finalTotalSetTime,
      restDuration: settings.restDuration,
    });
    
    setSets(finalSets);
    setPhase(PHASE.SUMMARY);
  };
  
  const handleResetWorkout = () => {
    setPhase(PHASE.IDLE);
    setSets([]);
    setCurrentTime(0);
    workoutTimeRef.current = 0;
    setWorkoutStartTime(null);
    setCompletedWorkout(null);
  }

  const handleSaveWorkout = (name: string, comment: string) => {
    if (!completedWorkout) return;

    const newWorkout: SavedWorkout = {
      id: Date.now(),
      date: new Date().toISOString(),
      name,
      comment,
      ...completedWorkout,
    };
    const updatedWorkouts = [...savedWorkouts, newWorkout];
    setSavedWorkouts(updatedWorkouts);
    localStorage.setItem(WORKOUT_HISTORY_KEY, JSON.stringify(updatedWorkouts));
    setShowSaveModal(false);
    handleResetWorkout();
  };

  const getPhaseInfo = () => {
    switch (phase) {
      case PHASE.IDLE: return { text: t('start'), color: "bg-green-500", subtext: t('tapToBegin') };
      case PHASE.WORKOUT: return { text: t('finishSet'), color: "bg-red-500", subtext: `${t('set')} ${sets.length + 1}` };
      case PHASE.REST: return { text: t('skipRest'), color: "bg-blue-500", subtext: t('resting') };
      default: return { text: "", color: "bg-gray-700", subtext: "" };
    }
  };

  if (phase === PHASE.SUMMARY && completedWorkout) {
      return (
        <>
          <WorkoutSummary 
            sets={completedWorkout.sets} 
            t={t} 
            onReset={handleResetWorkout} 
            onSaveRequest={() => setShowSaveModal(true)}
            totalWorkoutTime={completedWorkout.totalWorkoutTime}
            restDuration={completedWorkout.restDuration}
          />
          {showSaveModal && (
            <SaveWorkoutModal
                isOpen={showSaveModal}
                onClose={() => setShowSaveModal(false)}
                onSave={handleSaveWorkout}
                t={t}
                translations={translations[language]}
            />
          )}
        </>
      );
  }

  const { text: buttonText, color: buttonColor, subtext } = getPhaseInfo();

  return (
    <div className="flex flex-col h-screen w-screen bg-gray-900 text-white p-4 font-sans overflow-hidden">
      <header className="flex justify-between items-center w-full z-10">
        <h1 className="text-xl font-bold text-gray-400">{t('workoutTimer')}</h1>
        <div className="flex items-center gap-2">
            {phase === PHASE.IDLE && (
              <button onClick={() => setShowCalendar(true)} className="p-2 text-gray-400 hover:text-white transition-colors">
                <CalendarIcon />
              </button>
            )}
            <button onClick={() => setShowHistory(true)} className="p-2 text-gray-400 hover:text-white transition-colors">
              <HistoryIcon />
            </button>
            <button onClick={() => setShowSettings(true)} className="p-2 text-gray-400 hover:text-white transition-colors">
              <SettingsIcon />
            </button>
        </div>
      </header>
      
      <div className={`fixed inset-0 bg-black bg-opacity-70 z-40 transition-opacity ${showHistory ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={() => setShowHistory(false)}></div>
      <div className={`fixed top-0 right-0 w-4/5 max-w-sm h-full bg-gray-800 shadow-2xl z-50 p-4 transform transition-transform duration-300 ease-in-out ${showHistory ? 'translate-x-0' : 'translate-x-full'}`}>
          <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">{t('history')}</h2>
              <button onClick={() => setShowHistory(false)} className="p-2 text-gray-400 hover:text-white">
                  <XIcon />
              </button>
          </div>
          <SetHistory sets={sets} t={t} />
      </div>

      <main className="flex flex-col flex-grow items-center justify-center relative -mt-8 landscape:flex-row landscape:justify-evenly landscape:items-center landscape:mt-0 landscape:gap-4">
        <div className="text-center">
            <p className="text-2xl font-semibold text-gray-400 uppercase tracking-widest mb-4 landscape:order-2">{subtext}</p>
            <p style={{fontFamily: "'Roboto Mono', monospace"}} className="text-8xl md:text-9xl font-bold tabular-nums landscape:text-8xl landscape:order-1">
                {formatTime(currentTime)}
            </p>
        </div>
        
        <div className="absolute bottom-16 w-full px-4 flex justify-center landscape:static landscape:w-auto landscape:px-0 landscape:bottom-auto">
          <button
            onClick={handleMainAction}
            className={`w-48 h-48 md:w-56 md:h-56 rounded-full flex items-center justify-center text-white text-2xl font-bold uppercase shadow-lg transform transition-transform duration-200 active:scale-95 landscape:w-44 landscape:h-44 landscape:text-xl ${buttonColor}`}
          >
            {buttonText}
          </button>
        </div>
      </main>

      <footer className="w-full p-4 flex justify-center z-10">
        {phase !== PHASE.IDLE && (
          <button
            onClick={() => handleEndWorkout()}
            className="bg-gray-700 text-gray-300 font-bold py-3 px-6 rounded-lg hover:bg-gray-600 transition-colors"
          >
            {t('endAndReset')}
          </button>
        )}
      </footer>

      <SettingsModal
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        currentSettings={settings}
        onSave={(newSettings) => { setSettings(newSettings); setShowSettings(false); }}
        language={language}
        setLanguage={setLanguage}
        t={t}
        locales={locales}
      />
      <HistoryCalendar
        isOpen={showCalendar}
        onClose={() => setShowCalendar(false)}
        savedWorkouts={savedWorkouts}
        t={t}
      />
    </div>
  );
}