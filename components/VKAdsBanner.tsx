import React, { useEffect } from 'react';
import { Capacitor, registerPlugin } from '@capacitor/core';

interface VKAdsPlugin {
  loadBanner(options: { slotId: number; adSize?: string }): Promise<{ success: boolean; message?: string; error?: string }>;
  destroyBanner(): Promise<void>;
}

const VKAds = registerPlugin<VKAdsPlugin>('VKAds');

interface VKAdsBannerProps {
  blockId: number;
  width?: number;
  height?: number;
  className?: string;
}

export const VKAdsBanner: React.FC<VKAdsBannerProps> = ({ 
  blockId, 
  width = 320, 
  height = 50,
  className = '' 
}) => {
  useEffect(() => {
    if (!Capacitor.isNativePlatform()) {
      // Для веб-версии показываем placeholder
      console.log('VK Ads работает только в нативном приложении');
      return;
    }

    // Определяем размер баннера
    let adSize = 'banner_320x50';
    if (width === 300 && height === 250) {
      adSize = 'banner_300x250';
    } else if (width === 728 && height === 90) {
      adSize = 'banner_728x90';
    } else if (width === 320 && height === 50) {
      adSize = 'banner_320x50';
    }

    // Загружаем баннер через нативный плагин
    VKAds.loadBanner({
      slotId: blockId,
      adSize: adSize
    }).catch((error) => {
      console.error('Failed to load VK Ads banner:', error);
    });

    // Очистка при размонтировании
    return () => {
      if (Capacitor.isNativePlatform()) {
        VKAds.destroyBanner().catch(console.error);
      }
    };
  }, [blockId, width, height]);

  // Для нативной платформы компонент не рендерит ничего видимого,
  // так как баннер добавляется нативно
  if (Capacitor.isNativePlatform()) {
    return null;
  }

  // Для веб-версии показываем placeholder
  return (
    <div 
      className={`vk-ads-banner-container ${className}`}
      style={{ 
        width: '100%', 
        display: 'flex', 
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: `${height}px`,
        backgroundColor: '#1f2937'
      }}
    >
      <div className="text-gray-500 text-sm">Рекламный баннер (только в приложении)</div>
    </div>
  );
};
