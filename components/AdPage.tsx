import React, { useState, useEffect } from 'react';
import { Capacitor } from '@capacitor/core';
import { registerPlugin } from '@capacitor/core';
import { VKAdsNative } from './VKAdsNative';
import { XIcon } from './icons/Icons';

interface VKAdsPlugin {
  hideNativeAd(): Promise<void>;
}

const VKAds = registerPlugin<VKAdsPlugin>('VKAds');

interface AdPageProps {
  onClose: () => void;
}

export const AdPage: React.FC<AdPageProps> = ({ onClose }) => {
  const [showCloseButton, setShowCloseButton] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    // Показываем кнопку закрытия через 3 секунды
    const timer = setTimeout(() => {
      setShowCloseButton(true);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const handleClose = async (e: React.MouseEvent | React.TouchEvent) => {
    // Предотвращаем любое распространение события
    e.preventDefault();
    e.stopPropagation();
    
    // Если уже закрываем, игнорируем повторные клики
    if (isClosing) return;
    
    // Устанавливаем флаг закрытия
    setIsClosing(true);
    
    // Скрываем нативную рекламу перед закрытием
    if (Capacitor.isNativePlatform()) {
      try {
        await VKAds.hideNativeAd();
      } catch (error) {
        console.error('Error hiding native ad:', error);
      }
    }
    
    // Добавляем задержку перед закрытием, чтобы клик не "провалился" на элементы под окном
    setTimeout(() => {
    onClose();
    }, 150);
  };

  return (
    <div 
      className={`fixed inset-0 bg-gray-900 z-50 flex flex-col transition-opacity duration-200 ${isClosing ? 'opacity-0' : 'opacity-100'}`}
      style={{ pointerEvents: isClosing ? 'none' : 'auto' }}
    >
      {/* Безопасная область сверху для Android/iOS */}
      <div className="safe-area-inset-top bg-gray-900 w-full"></div>
      
      <div className="flex-1 flex flex-col items-center justify-center relative">
      {/* Нативная реклама на весь экран - добавляется нативно */}
      <VKAdsNative blockId={1936883} />
      
      {/* Кнопка закрытия появляется через несколько секунд */}
      {showCloseButton && !isClosing && (
        <button
          onClick={handleClose}
          onTouchEnd={handleClose}
          className="absolute top-4 right-4 w-12 h-12 bg-gray-800 bg-opacity-90 hover:bg-opacity-100 active:bg-opacity-100 rounded-full flex items-center justify-center text-white transition-all duration-300 z-[100] cursor-pointer touch-manipulation"
          style={{ pointerEvents: 'auto' }}
          aria-label="Закрыть"
        >
          <XIcon />
        </button>
      )}
      </div>
    </div>
  );
};



