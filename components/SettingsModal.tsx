import React, { useState, useEffect } from 'react';
import { XIcon } from './icons/Icons';
import type { AppSettings, EndSound } from '../types';

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
  const [sound, setSound] = useState<EndSound>('beep');

  useEffect(() => {
    if (isOpen) {
        setMinutes(Math.floor(currentSettings.restDuration / 60));
        setSeconds(currentSettings.restDuration % 60);
        setTargetSets(currentSettings.targetSets);
        setSound(currentSettings.endSound);
    }
  }, [isOpen, currentSettings]);

  if (!isOpen) return null;

  const handleSave = () => {
    const totalSeconds = minutes * 60 + seconds;
    if (totalSeconds > 0) {
        onSave({
            restDuration: totalSeconds,
            targetSets: targetSets,
            endSound: sound
        });
    }
  };
  
  const handleMinuteChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value, 10);
    setMinutes(isNaN(val) ? 0 : Math.max(0, val));
  };
  
  const handleSecondChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = parseInt(e.target.value, 10);
    if (isNaN(val)) val = 0;
    if (e.target.value.length > 2) {
        val = parseInt(e.target.value.slice(-2), 10);
    }
    setSeconds(Math.max(0, Math.min(59, val)));
  };

  const handleTargetSetsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value, 10);
    setTargetSets(isNaN(val) ? 0 : Math.max(0, val));
  };


  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-xl shadow-2xl p-6 w-full max-w-sm overflow-y-auto max-h-full">
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
                  <input type="number" value={minutes} onChange={handleMinuteChange} className="w-full bg-transparent text-white text-4xl font-bold text-center outline-none" min="0"/>
                  <p className="text-gray-400 text-center text-sm">{t('minutes')}</p>
                </div>
                <span className="text-4xl font-bold text-gray-500">:</span>
                 <div className="flex-1">
                  <input type="number" value={seconds.toString().padStart(2, '0')} onChange={handleSecondChange} className="w-full bg-transparent text-white text-4xl font-bold text-center outline-none" min="0" max="59"/>
                  <p className="text-gray-400 text-center text-sm">{t('seconds')}</p>
                </div>
              </div>
            </div>

            <div>
                <label className="block text-lg font-medium text-gray-300 mb-2">{t('targetSets')}</label>
                 <div className="flex items-center gap-4 bg-gray-900 p-4 rounded-lg">
                    <input
                        type="number"
                        value={targetSets}
                        onChange={handleTargetSetsChange}
                        className="w-full bg-transparent text-white text-4xl font-bold text-center outline-none"
                        min="0"
                    />
                 </div>
                 <p className="text-gray-400 text-center text-sm mt-1">{targetSets === 0 ? t('infinite') : `${targetSets} ${t('set')}`}</p>
            </div>

            <div>
                <label className="block text-lg font-medium text-gray-300 mb-2">{t('endOfRestSound')}</label>
                <div className="grid grid-cols-2 gap-2">
                    <button onClick={() => setSound('beep')} className={`py-3 px-3 rounded-md text-base font-semibold transition-colors ${sound === 'beep' ? 'bg-green-600 text-white' : 'bg-gray-700 hover:bg-gray-600'}`}>
                        {t('beep')}
                    </button>
                    <button onClick={() => setSound('voice')} className={`py-3 px-3 rounded-md text-base font-semibold transition-colors ${sound === 'voice' ? 'bg-green-600 text-white' : 'bg-gray-700 hover:bg-gray-600'}`}>
                        {t('voice')}
                    </button>
                </div>
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
  );
};