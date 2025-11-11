import React, { useState, useEffect } from 'react';
import { XIcon } from './icons/Icons';
import type { AppSettings } from '../types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentSettings: AppSettings;
  onSave: (settings: AppSettings) => void;
  language: string;
  setLanguage: (lang: string) => void;
  t: (key: string) => string;
  locales: { [key: string]: string };
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, currentSettings, onSave, language, setLanguage, t, locales }) => {
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [targetSets, setTargetSets] = useState(0);

  useEffect(() => {
    if (isOpen) {
        setMinutes(Math.floor(currentSettings.restDuration / 60));
        setSeconds(currentSettings.restDuration % 60);
        setTargetSets(currentSettings.targetSets);
    }
  }, [isOpen, currentSettings]);

  if (!isOpen) return null;

  const handleSave = () => {
    const totalSeconds = minutes * 60 + seconds;
    if (totalSeconds > 0) {
        onSave({
            restDuration: totalSeconds,
            targetSets: targetSets,
            endSound: currentSettings.endSound // Keep existing sound setting
        });
    }
  };
  


  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex flex-col">
      {/* Безопасная область сверху для Android/iOS */}
      <div className="safe-area-inset-top bg-transparent w-full"></div>
      
      <div className="flex-1 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-gray-800 rounded-xl shadow-2xl p-6 w-full max-w-sm">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">{t('settings')}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <XIcon />
          </button>
        </div>
        
        <div className="space-y-6">
            <div>
              <label className="block text-lg font-medium text-gray-300 mb-2">{t('restTime')}</label>
              <div className="flex items-center gap-4 bg-gray-900 p-4 rounded-lg">
                <div className="flex-1">
                  <div className="flex flex-col items-center">
                    <button 
                      onClick={() => setMinutes(prev => Math.min(99, prev + 1))}
                      className="w-12 h-12 bg-gray-700 hover:bg-gray-600 rounded-lg text-2xl font-bold text-white mb-2 transition-colors"
                    >
                      +
                    </button>
                    <div className="text-white text-4xl font-bold text-center min-h-[3rem] flex items-center justify-center">
                      {minutes.toString().padStart(2, '0')}
                    </div>
                    <button 
                      onClick={() => setMinutes(prev => Math.max(0, prev - 1))}
                      className="w-12 h-12 bg-gray-700 hover:bg-gray-600 rounded-lg text-2xl font-bold text-white mt-2 transition-colors"
                    >
                      −
                    </button>
                  </div>
                  <p className="text-gray-400 text-center text-sm mt-2">{t('minutes')}</p>
                </div>
                <span className="text-4xl font-bold text-gray-500">:</span>
                <div className="flex-1">
                  <div className="flex flex-col items-center">
                    <button 
                      onClick={() => setSeconds(prev => {
                        const newVal = prev + 1;
                        return newVal >= 60 ? 0 : newVal;
                      })}
                      className="w-12 h-12 bg-gray-700 hover:bg-gray-600 rounded-lg text-2xl font-bold text-white mb-2 transition-colors"
                    >
                      +
                    </button>
                    <div className="text-white text-4xl font-bold text-center min-h-[3rem] flex items-center justify-center">
                      {seconds.toString().padStart(2, '0')}
                    </div>
                    <button 
                      onClick={() => setSeconds(prev => {
                        const newVal = prev - 1;
                        return newVal < 0 ? 59 : newVal;
                      })}
                      className="w-12 h-12 bg-gray-700 hover:bg-gray-600 rounded-lg text-2xl font-bold text-white mt-2 transition-colors"
                    >
                      −
                    </button>
                  </div>
                  <p className="text-gray-400 text-center text-sm mt-2">{t('seconds')}</p>
                </div>
              </div>
            </div>

            <div>
                <label className="block text-lg font-medium text-gray-300 mb-2">{t('targetSets')}</label>
                 <div className="flex items-center justify-center gap-4 bg-gray-900 p-4 rounded-lg">
                    <button 
                      onClick={() => setTargetSets(prev => Math.max(0, prev - 1))}
                      className="w-12 h-12 bg-gray-700 hover:bg-gray-600 rounded-lg text-2xl font-bold text-white transition-colors"
                    >
                      −
                    </button>
                    <div className="text-white text-4xl font-bold text-center min-w-[4rem] min-h-[3rem] flex items-center justify-center">
                      {targetSets === 0 ? '∞' : targetSets}
                    </div>
                    <button 
                      onClick={() => setTargetSets(prev => Math.min(999, prev + 1))}
                      className="w-12 h-12 bg-gray-700 hover:bg-gray-600 rounded-lg text-2xl font-bold text-white transition-colors"
                    >
                      +
                    </button>
                 </div>
                 <p className="text-gray-400 text-center text-sm mt-1">{targetSets === 0 ? t('infinite') : `${targetSets} ${t('set')}`}</p>
            </div>

            <div>
                <label className="block text-lg font-medium text-gray-300 mb-2">{t('language')}</label>
                <div className="grid grid-cols-3 gap-2">
                    {Object.keys(locales).map((langKey) => (
                        <button key={langKey} onClick={() => setLanguage(langKey)} className={`py-2 px-3 rounded-md text-sm font-semibold transition-colors ${language === langKey ? 'bg-green-600 text-white' : 'bg-gray-700 hover:bg-gray-600'}`}>
                            {locales[langKey]}
                        </button>
                    ))}
                </div>
            </div>
        </div>
        
        <button
          onClick={handleSave}
          className="w-full mt-8 bg-green-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-green-500 transition-colors text-lg"
        >
          {t('saveSettings')}
        </button>
      </div>
      </div>
    </div>
  );
};