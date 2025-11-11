import React, { useEffect } from 'react';
import { Capacitor, registerPlugin } from '@capacitor/core';

interface VKAdsPlugin {
  loadNativeAd(options: { slotId: number }): Promise<{ success: boolean; message?: string; error?: string }>;
  destroyNativeAd(): Promise<void>;
  hideNativeAd(): Promise<void>;
}

const VKAds = registerPlugin<VKAdsPlugin>('VKAds');

interface VKAdsNativeProps {
  blockId: number;
  className?: string;
}

export const VKAdsNative: React.FC<VKAdsNativeProps> = ({ 
  blockId,
  className = '' 
}) => {
  useEffect(() => {
    if (!Capacitor.isNativePlatform()) {
      // Для веб-версии показываем placeholder
      console.log('VK Ads работает только в нативном приложении');
      return;
    }

    // Загружаем нативную рекламу через нативный плагин
    VKAds.loadNativeAd({
      slotId: blockId
    }).catch((error) => {
      console.error('Failed to load VK Ads native ad:', error);
    });

    // Очистка при размонтировании
    return () => {
      if (Capacitor.isNativePlatform()) {
        VKAds.destroyNativeAd().catch(console.error);
      }
    };
  }, [blockId]);

  // Для нативной платформы компонент не рендерит ничего видимого,
  // так как реклама добавляется нативно
  if (Capacitor.isNativePlatform()) {
    return null;
  }

  // Для веб-версии показываем placeholder
  return (
    <div 
      className={`vk-ads-native-container ${className}`}
      style={{ 
        width: '100%', 
        display: 'flex', 
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100px',
        backgroundColor: '#1f2937'
      }}
    >
      <div className="text-gray-500 text-sm">Нативная реклама (только в приложении)</div>
    </div>
  );
};
