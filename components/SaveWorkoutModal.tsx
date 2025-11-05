import React, { useState, useEffect } from 'react';
import { XIcon } from './icons/Icons';

interface SaveWorkoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (name: string, comment: string) => void;
  t: (key: string) => string;
  translations: any;
}

const PREDEFINED_KEYS = ['legs', 'arms', 'back', 'chest', 'shoulders', 'core', 'cardio', 'other'];

export const SaveWorkoutModal: React.FC<SaveWorkoutModalProps> = ({ isOpen, onClose, onSave, t, translations }) => {
  const [selectedName, setSelectedName] = useState('legs');
  const [customName, setCustomName] = useState('');
  const [comment, setComment] = useState('');

  useEffect(() => {
    if (isOpen) {
      setSelectedName('legs');
      setCustomName('');
      setComment('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSave = () => {
    const finalName = selectedName === 'other' ? (customName.trim() || t('predefinedNames.other')) : translations.predefinedNames[selectedName];
    onSave(finalName, comment.trim());
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-xl shadow-2xl p-6 w-full max-w-sm">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">{t('saveWorkout')}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <XIcon />
          </button>
        </div>

        <div>
          <label className="block text-lg font-medium text-gray-300 mb-2">{t('workoutName')}</label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {PREDEFINED_KEYS.map((nameKey) => (
              <button
                key={nameKey}
                onClick={() => setSelectedName(nameKey)}
                className={`py-2 px-3 rounded-md text-sm font-semibold transition-colors ${selectedName === nameKey ? 'bg-green-600 text-white' : 'bg-gray-700 hover:bg-gray-600'}`}
              >
                {translations.predefinedNames[nameKey]}
              </button>
            ))}
          </div>
          {selectedName === 'other' && (
            <input
              type="text"
              value={customName}
              onChange={(e) => setCustomName(e.target.value)}
              placeholder={t('customName')}
              className="mt-3 w-full bg-gray-900 text-white p-2 rounded-md border border-gray-600 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
            />
          )}
        </div>

        <div className="mt-6">
          <label className="block text-lg font-medium text-gray-300 mb-2">{t('commentOptional')}</label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={3}
            className="w-full bg-gray-900 text-white p-2 rounded-md border border-gray-600 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
          />
        </div>

        <div className="mt-8 flex gap-4">
          <button onClick={onClose} className="w-full bg-gray-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-gray-500 transition-colors text-lg">
            {t('cancel')}
          </button>
          <button onClick={handleSave} className="w-full bg-green-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-green-500 transition-colors text-lg">
            {t('save')}
          </button>
        </div>
      </div>
    </div>
  );
};
