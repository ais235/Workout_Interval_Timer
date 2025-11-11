package com.workoutintervaltimer.rustore;

import android.view.ViewGroup;
import android.widget.FrameLayout;
import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;
import com.my.target.ads.MyTargetView;
import com.my.target.nativeads.NativeAd;
import com.my.target.nativeads.views.NativeAdContainer;
import com.my.target.nativeads.views.NativeAdView;
import com.my.target.nativeads.factories.NativeViewsFactory;
import android.widget.LinearLayout;
import android.widget.TextView;
import android.widget.Button;
import android.view.View;
import android.content.Context;

@CapacitorPlugin(name = "VKAds")
public class VKAdsPlugin extends Plugin {

    private MyTargetView bannerAdView;
    private NativeAd nativeAd;
    private NativeAdContainer nativeAdContainer;

    @PluginMethod
    public void loadBanner(PluginCall call) {
        int slotId = call.getInt("slotId", 1936811);
        String adSize = call.getString("adSize", "banner_320x50");
        
        getActivity().runOnUiThread(() -> {
            try {
                // Удаляем предыдущий баннер, если есть
                if (bannerAdView != null) {
                    ViewGroup parent = (ViewGroup) bannerAdView.getParent();
                    if (parent != null) {
                        parent.removeView(bannerAdView);
                    }
                    bannerAdView.destroy();
                }

                // Создаем новый экземпляр MyTargetView
                bannerAdView = new MyTargetView(getContext());
                bannerAdView.setSlotId(slotId);
                
                // Устанавливаем размер баннера
                if (adSize.equals("banner_320x50")) {
                    bannerAdView.setAdSize(MyTargetView.AdSize.ADSIZE_320x50);
                } else if (adSize.equals("banner_300x250")) {
                    bannerAdView.setAdSize(MyTargetView.AdSize.ADSIZE_300x250);
                } else if (adSize.equals("banner_728x90")) {
                    bannerAdView.setAdSize(MyTargetView.AdSize.ADSIZE_728x90);
                }
                // По умолчанию используется адаптивный формат

                // Включаем ротацию (каждые 60 секунд)
                bannerAdView.setRefreshAd(true);

                // Устанавливаем слушатель событий
                bannerAdView.setListener(new MyTargetView.MyTargetViewListener() {
                    @Override
                    public void onLoad(MyTargetView myTargetView) {
                        // Данные успешно загружены
                        JSObject result = new JSObject();
                        result.put("success", true);
                        result.put("message", "Banner loaded");
                        call.resolve(result);
                    }

                    @Override
                    public void onNoAd(com.my.target.common.models.IAdLoadingError error, MyTargetView myTargetView) {
                        JSObject result = new JSObject();
                        result.put("success", false);
                        String errorMsg = error != null ? error.getMessage() : "Unknown error";
                        result.put("error", errorMsg);
                        call.reject(errorMsg);
                    }

                    @Override
                    public void onShow(MyTargetView myTargetView) {
                        // Баннер показан
                    }

                    @Override
                    public void onClick(MyTargetView myTargetView) {
                        // Клик по рекламе
                    }
                });

                // Добавляем баннер в контейнер внизу экрана
                MainActivity activity = (MainActivity) getActivity();
                if (activity != null) {
                    FrameLayout adContainer = activity.getBannerContainer();
                    if (adContainer != null) {
                        FrameLayout.LayoutParams params = new FrameLayout.LayoutParams(
                            ViewGroup.LayoutParams.MATCH_PARENT,
                            ViewGroup.LayoutParams.WRAP_CONTENT
                        );
                        params.bottomMargin = 0;
                        bannerAdView.setLayoutParams(params);
                        adContainer.addView(bannerAdView);
                    } else {
                        // Если контейнер еще не создан, добавляем в корневой view
                        ViewGroup rootView = (ViewGroup) getActivity().getWindow().getDecorView().getRootView();
                        FrameLayout.LayoutParams params = new FrameLayout.LayoutParams(
                            ViewGroup.LayoutParams.MATCH_PARENT,
                            ViewGroup.LayoutParams.WRAP_CONTENT
                        );
                        params.bottomMargin = 0;
                        bannerAdView.setLayoutParams(params);
                        rootView.addView(bannerAdView);
                    }
                }

                // Запускаем загрузку данных
                bannerAdView.load();

            } catch (Exception e) {
                call.reject("Failed to load banner: " + e.getMessage());
            }
        });
    }

    @PluginMethod
    public void destroyBanner(PluginCall call) {
        getActivity().runOnUiThread(() -> {
            if (bannerAdView != null) {
                ViewGroup parent = (ViewGroup) bannerAdView.getParent();
                if (parent != null) {
                    parent.removeView(bannerAdView);
                }
                bannerAdView.destroy();
                bannerAdView = null;
            }
            call.resolve();
        });
    }

    @PluginMethod
    public void loadNativeAd(PluginCall call) {
        int slotId = call.getInt("slotId", 1936883);
        
        getActivity().runOnUiThread(() -> {
            try {
                // Удаляем предыдущую нативную рекламу, если есть
                if (nativeAd != null) {
                    if (nativeAdContainer != null) {
                        nativeAd.unregisterView();
                        ViewGroup parent = (ViewGroup) nativeAdContainer.getParent();
                        if (parent != null) {
                            parent.removeView(nativeAdContainer);
                        }
                    }
                    nativeAd = null;
                    nativeAdContainer = null;
                }

                // Создаем экземпляр NativeAd
                nativeAd = new NativeAd(slotId, getContext());

                // Устанавливаем слушатель событий
                nativeAd.setListener(new NativeAd.NativeAdListener() {
                    @Override
                    public void onLoad(com.my.target.nativeads.banners.NativePromoBanner banner, NativeAd ad) {
                        // Используем готовый компонент, который автоматически заполняет все данные
                        try {
                            // Используем готовый компонент NativeAdView
                            Context context = getContext();
                            NativeAdView nativeAdView = NativeViewsFactory.getNativeAdView(context);

                            // Создаем контейнер для креатива
                            nativeAdContainer = new NativeAdContainer(context);
                            nativeAdContainer.addView(nativeAdView);

                            // Регистрируем визуальный компонент
                            ad.registerView(nativeAdContainer);

                            // Добавляем на экран (в контейнер для нативной рекламы)
                            MainActivity activity = (MainActivity) getActivity();
                            if (activity != null) {
                                FrameLayout nativeContainer = activity.getNativeAdContainer();
                                if (nativeContainer != null) {
                                    nativeContainer.removeAllViews();
                                    nativeContainer.addView(nativeAdContainer);
                                    // Показываем контейнер (для полноэкранного показа)
                                    activity.showNativeAdContainer();
                                }
                            }

                            JSObject result = new JSObject();
                            result.put("success", true);
                            result.put("message", "Native ad loaded");
                            call.resolve(result);
                        } catch (Exception e) {
                            call.reject("Failed to create native ad view: " + e.getMessage());
                        }
                    }

                    @Override
                    public void onNoAd(com.my.target.common.models.IAdLoadingError error, NativeAd ad) {
                        JSObject result = new JSObject();
                        result.put("success", false);
                        String errorMsg = error != null ? error.getMessage() : "Unknown error";
                        result.put("error", errorMsg);
                        call.reject(errorMsg);
                    }

                    @Override
                    public void onClick(NativeAd ad) {
                        // Клик по рекламе
                    }

                    @Override
                    public void onShow(NativeAd ad) {
                        // Реклама показана
                    }

                    @Override
                    public void onVideoPlay(NativeAd ad) {
                        // Видео началось
                    }

                    @Override
                    public void onVideoPause(NativeAd ad) {
                        // Видео приостановлено
                    }

                    @Override
                    public void onVideoComplete(NativeAd ad) {
                        // Видео завершено
                    }
                });

                // Запускаем загрузку данных
                nativeAd.load();

            } catch (Exception e) {
                call.reject("Failed to load native ad: " + e.getMessage());
            }
        });
    }

    @PluginMethod
    public void destroyNativeAd(PluginCall call) {
        getActivity().runOnUiThread(() -> {
            if (nativeAd != null) {
                if (nativeAdContainer != null) {
                    nativeAd.unregisterView();
                    ViewGroup parent = (ViewGroup) nativeAdContainer.getParent();
                    if (parent != null) {
                        parent.removeView(nativeAdContainer);
                    }
                }
                nativeAd = null;
                nativeAdContainer = null;
            }
            // Скрываем контейнер
            MainActivity activity = (MainActivity) getActivity();
            if (activity != null) {
                activity.hideNativeAdContainer();
            }
            call.resolve();
        });
    }
    
    @PluginMethod
    public void hideNativeAd(PluginCall call) {
        getActivity().runOnUiThread(() -> {
            MainActivity activity = (MainActivity) getActivity();
            if (activity != null) {
                activity.hideNativeAdContainer();
            }
            call.resolve();
        });
    }

    @Override
    protected void handleOnDestroy() {
        if (bannerAdView != null) {
            bannerAdView.destroy();
            bannerAdView = null;
        }
        if (nativeAd != null) {
            if (nativeAdContainer != null) {
                nativeAd.unregisterView();
            }
            nativeAd = null;
            nativeAdContainer = null;
        }
        super.handleOnDestroy();
    }
}

