import React, { useState, useEffect, useCallback, useRef } from 'react';
import { SettingsIcon, HistoryIcon, XIcon, CalendarIcon, ExitIcon } from './components/icons/Icons';
import { SetHistory } from './components/SetHistory';
import { SettingsModal } from './components/SettingsModal';
import { WorkoutSummary } from './components/WorkoutSummary';
import { SaveWorkoutModal } from './components/SaveWorkoutModal';
import { HistoryCalendar } from './components/HistoryCalendar';
import { AdPage } from './components/AdPage';
import { VKAdsBanner } from './components/VKAdsBanner';
import { VKAdsNative } from './components/VKAdsNative';
import { useWakeLock } from './hooks/useWakeLock';
import { useAudio } from './hooks/useAudio';
import { useSpeech } from './hooks/useSpeech';
import { BEEP_SOUND_URL, GONG_SOUND_URL, TICK_SOUND_URL, START_SET_SOUND_URL } from './constants';
import type { WorkoutPhase, Set, SavedWorkout, AppSettings } from './types';
import { PHASE } from './types';
import { App as CapacitorApp } from '@capacitor/app';
import { ExitApp } from './src/plugins/ExitApp';

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
    nextSet: 'Next Set',
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
    exitApp: 'Exit App',
    expand: 'Expand',
    collapse: 'Collapse',
    timeIndicators: 'time indicators',
    weekDays: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
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
    nextSet: 'Próxima Serie',
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
    exitApp: 'Salir de la App',
    expand: 'Expandir',
    collapse: 'Contraer',
    timeIndicators: 'indicadores de tiempo',
    weekDays: ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'],
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
    nextSet: 'Следующий подход',
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
    exitApp: 'Выйти из приложения',
    expand: 'Развернуть',
    collapse: 'Свернуть',
    timeIndicators: 'показатели времени',
    weekDays: ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'],
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
const WORKOUT_LANGUAGE_KEY = 'workout_timer_language';

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
  const [showAdPage, setShowAdPage] = useState(false);
  const [language, setLanguage] = useState(() => {
    // Load language from localStorage or default to 'ru'
    try {
      const storedLanguage = localStorage.getItem(WORKOUT_LANGUAGE_KEY);
      return storedLanguage && ['en', 'es', 'ru'].includes(storedLanguage) ? storedLanguage : 'ru';
    } catch (error) {
      return 'ru';
    }
  });
  const [savedWorkouts, setSavedWorkouts] = useState<SavedWorkout[]>([]);
  const [workoutStartTime, setWorkoutStartTime] = useState<number | null>(null);
  const [completedWorkout, setCompletedWorkout] = useState<CompletedWorkout | null>(null);

  const t = useCallback((key: string, options?: Record<string, string>) => {
      const translation = translations[language][key];
      if (translation === undefined) return key;
      if (typeof translation === 'object' && translation !== null) {
          // Return array as-is for weekDays
          if (Array.isArray(translation)) {
              return translation;
          }
          return key;
      }
      return translation;
  }, [language]);

  const workoutTimeRef = useRef(0);
  const intervalRef = useRef<number | null>(null);
  const lastTickSecondRef = useRef<number | null>(null);

  const { play: playBeep } = useAudio(BEEP_SOUND_URL);
  const { play: playGong } = useAudio(GONG_SOUND_URL);
  const { play: playTick } = useAudio(TICK_SOUND_URL);
  const { play: playStartSet } = useAudio(START_SET_SOUND_URL);
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

      // Language is already loaded in useState initializer
    } catch (error) {
      console.error("Failed to load data from localStorage:", error);
    }
  }, []);

  useEffect(() => {
      localStorage.setItem(WORKOUT_SETTINGS_KEY, JSON.stringify(settings));
  }, [settings]);

  // Save language to localStorage when it changes
  useEffect(() => {
    try {
      localStorage.setItem(WORKOUT_LANGUAGE_KEY, language);
    } catch (error) {
      console.error("Failed to save language to localStorage:", error);
    }
  }, [language]);

  const stopTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (phase === PHASE.REST && currentTime <= 0) {
      // Play start set sound when rest ends
      playStartSet();
      if (settings.endSound === 'voice') {
        const nextSetText = `${t('set')} ${sets.length + 1}`;
        speak(nextSetText, language);
      }
      setPhase(PHASE.WORKOUT);
      setCurrentTime(0);
      workoutTimeRef.current = 0;
    }
  }, [currentTime, phase, playStartSet, sets.length, settings.endSound, speak, t, language]);

  // Play tick sound for last 3 seconds of rest (once per second)
  useEffect(() => {
    if (phase === PHASE.REST && currentTime > 0 && currentTime <= 3) {
      // Only play tick if we haven't played it for this second yet
      if (lastTickSecondRef.current !== currentTime) {
        lastTickSecondRef.current = currentTime;
        // Small delay to ensure the sound plays after state update
        setTimeout(() => {
          playTick();
        }, 50);
      }
    } else if (phase !== PHASE.REST) {
      lastTickSecondRef.current = null;
    }
  }, [currentTime, phase, playTick]);
  
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
      playStartSet(); // Play sound when starting first set
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
      playStartSet();
      if (settings.endSound === 'voice') {
        const nextSetText = `${t('set')} ${sets.length + 1}`;
        speak(nextSetText, language);
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

    // Play gong sound when workout ends (only if target sets were set and completed)
    if (settings.targetSets > 0 && finalSets.length >= settings.targetSets) {
      playGong();
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

  const handleResetWorkoutWithAd = () => {
    handleResetWorkout();
    setShowAdPage(true);
  }

  const handleExitApp = async () => {
    try {
      // Прямой вызов через JavaScript Interface (работает даже если androidBridge не готов)
      if (Capacitor.isNativePlatform() && (window as any).AndroidInterface) {
        (window as any).AndroidInterface.exitApp();
        return;
      }
      
      // Fallback: используем стандартный CapacitorApp.exitApp()
      await CapacitorApp.exitApp();
    } catch (error) {
      console.error('Error exiting app:', error);
      // Fallback: пробуем кастомный плагин
      try {
        if (Capacitor.isNativePlatform()) {
          await ExitApp.exit();
        }
      } catch (pluginError) {
        console.error('Error with ExitApp plugin:', pluginError);
        // Последний fallback для веб-версии
        if (window) {
          window.close();
        }
      }
    }
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
    setShowAdPage(true);
  };

  const handleCancelSave = () => {
    setShowSaveModal(false);
    handleResetWorkout();
    setShowAdPage(true);
  };

  const getPhaseInfo = () => {
    switch (phase) {
      case PHASE.IDLE: return { text: t('start'), color: "bg-green-500", subtext: t('tapToBegin'), nextSetText: null };
      case PHASE.WORKOUT: return { text: t('finishSet'), color: "bg-red-500", subtext: `${t('set')} ${sets.length + 1}`, nextSetText: null };
      case PHASE.REST: return { 
        text: t('skipRest'), 
        color: "bg-blue-500", 
        subtext: t('resting'),
        nextSetText: `${t('nextSet')} ${sets.length + 1}`
      };
      default: return { text: "", color: "bg-gray-700", subtext: "", nextSetText: null };
    }
  };

  if (phase === PHASE.SUMMARY && completedWorkout) {
      return (
        <>
          <WorkoutSummary 
            sets={completedWorkout.sets} 
            t={t} 
            onReset={handleResetWorkoutWithAd} 
            onSaveRequest={() => setShowSaveModal(true)}
            totalWorkoutTime={completedWorkout.totalWorkoutTime}
            restDuration={completedWorkout.restDuration}
          />
          {showSaveModal && (
            <SaveWorkoutModal
                isOpen={showSaveModal}
                onClose={handleCancelSave}
                onSave={handleSaveWorkout}
                t={t}
                translations={translations[language]}
            />
          )}
        </>
      );
  }

  const { text: buttonText, color: buttonColor, subtext, nextSetText } = getPhaseInfo();

  return (
    <div className="flex flex-col h-screen w-screen bg-gray-900 text-white font-sans overflow-hidden">
      {/* Безопасная область сверху для Android/iOS */}
      <div className="safe-area-inset-top bg-gray-900 w-full"></div>
      
      <div className="flex flex-col flex-1 p-4 pt-2 overflow-hidden">
      <header className="flex justify-between items-center w-full z-10">
        <h1 className="text-xl font-bold text-gray-400">{t('workoutTimer')}</h1>
        <div className="flex items-center gap-2">
            {phase === PHASE.IDLE && (
              <>
                <button onClick={() => setShowCalendar(true)} className="p-2 text-gray-400 hover:text-white transition-colors" title={t('workoutHistory')}>
                  <CalendarIcon />
                </button>
                <button 
                  onClick={handleExitApp} 
                  className="p-2 text-gray-400 hover:text-red-400 transition-colors"
                  title={t('exitApp')}
                >
                  <ExitIcon />
                </button>
              </>
            )}
            <button onClick={() => setShowHistory(true)} className="p-2 text-gray-400 hover:text-white transition-colors" title={t('history')}>
              <HistoryIcon />
            </button>
            <button onClick={() => setShowSettings(true)} className="p-2 text-gray-400 hover:text-white transition-colors" title={t('settings')}>
              <SettingsIcon />
            </button>
        </div>
      </header>
      
      <div className={`fixed inset-0 bg-black bg-opacity-70 z-40 transition-opacity ${showHistory ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={() => setShowHistory(false)}></div>
      <div className={`fixed top-0 right-0 w-4/5 max-w-sm h-full bg-gray-800 shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${showHistory ? 'translate-x-0' : 'translate-x-full'} flex flex-col`}>
          {/* Безопасная область сверху для Android/iOS */}
          <div className="safe-area-inset-top bg-gray-800 w-full"></div>
          
          <div className="flex-1 flex flex-col p-4 overflow-hidden">
          <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">{t('history')}</h2>
              <button onClick={() => setShowHistory(false)} className="p-2 text-gray-400 hover:text-white" title={t('close')}>
                  <XIcon />
              </button>
          </div>
          <SetHistory sets={sets} t={t} />
          </div>
      </div>

      <main className="flex flex-col flex-grow items-center justify-center relative landscape:flex-row landscape:justify-evenly landscape:items-center landscape:gap-4 pb-[50px]">
        {/* Фиксированная область для текста над таймером - всегда занимает одинаковое место */}
        <div className="text-center h-32 flex flex-col justify-end landscape:h-auto landscape:order-2">
            {nextSetText ? (
              <p className="text-xl font-semibold text-blue-400 uppercase tracking-widest mb-3">{nextSetText}</p>
            ) : (
              <div className="h-7 mb-3"></div>
            )}
            <p className="text-2xl font-semibold text-gray-400 uppercase tracking-widest mb-6 min-h-[2.5rem] flex items-center justify-center">{subtext}</p>
        </div>
        
        {/* Фиксированная позиция таймера */}
        <div className="text-center landscape:order-1">
            <p style={{fontFamily: "'Roboto Mono', monospace"}} className="text-8xl md:text-9xl font-bold tabular-nums landscape:text-8xl">
                {formatTime(currentTime)}
            </p>
        </div>
        
        {/* Фиксированная позиция кнопки */}
        <div className="w-full px-4 flex justify-center mt-8 landscape:static landscape:w-auto landscape:px-0 landscape:mt-8 landscape:order-3">
          <button
            onClick={handleMainAction}
            className={`w-48 h-48 md:w-56 md:h-56 rounded-full flex items-center justify-center text-white text-2xl font-bold uppercase shadow-lg transform transition-transform duration-200 active:scale-95 landscape:w-44 landscape:h-44 landscape:text-xl ${buttonColor}`}
          >
            {buttonText}
          </button>
        </div>
      </main>

      {/* Footer с кнопкой "Завершить и Сбросить" - фиксирован над баннером */}
      {phase !== PHASE.IDLE && (
        <footer className="fixed bottom-[50px] left-0 right-0 w-full p-4 flex justify-center z-20">
          <button
            onClick={() => handleEndWorkout()}
            className="bg-gray-700 text-gray-300 font-bold py-3 px-6 rounded-lg hover:bg-gray-600 transition-colors"
          >
            {t('endAndReset')}
          </button>
        </footer>
      )}

      {/* VK Ads Banner 320x50 - нативный баннер добавляется через плагин внизу экрана */}
      <div className="fixed bottom-0 left-0 right-0 h-[50px] z-30">
        <VKAdsBanner blockId={1936811} width={320} height={50} />
      </div>

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
        language={language}
      />
      {showAdPage && (
        <AdPage onClose={() => setShowAdPage(false)} />
      )}
      </div>
    </div>
  );
}