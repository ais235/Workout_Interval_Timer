package com.workoutintervaltimer.rustore;

import android.os.Build;
import android.os.Bundle;
import android.view.View;
import android.view.ViewGroup;
import android.widget.FrameLayout;
import android.webkit.JavascriptInterface;
import android.webkit.WebView;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    private FrameLayout bannerContainer;
    private FrameLayout nativeAdContainer;
    
    // JavaScript Interface для прямого вызова exitApp
    public class AndroidJSInterface {
        @JavascriptInterface
        public void exitApp() {
            MainActivity.this.runOnUiThread(() -> {
                MainActivity.this.exitApp();
            });
        }
    }

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        
        // Плагины регистрируются автоматически через @CapacitorPlugin аннотацию
        // НЕ нужно вызывать registerPlugin() вручную!
        
        // Настройка edge-to-edge для Android - контент может заходить под системные панели
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.R) {
            getWindow().setDecorFitsSystemWindows(false);
        } else if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
            getWindow().getDecorView().setSystemUiVisibility(
                View.SYSTEM_UI_FLAG_LAYOUT_STABLE |
                View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN
            );
        }
        
        // Убираем статус-бар фон для прозрачности
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
            getWindow().setStatusBarColor(android.graphics.Color.TRANSPARENT);
        }
    }

    @Override
    public void onStart() {
        super.onStart();
        
        // Добавляем JavaScript Interface для прямого вызова exitApp
        try {
            WebView webView = getBridge().getWebView();
            if (webView != null) {
                webView.addJavascriptInterface(new AndroidJSInterface(), "AndroidInterface");
            }
        } catch (Exception e) {
            // Игнорируем ошибку, если WebView еще не готов
        }
        
        // Создаем и добавляем контейнеры после инициализации Bridge
        ViewGroup rootView = (ViewGroup) getWindow().getDecorView().getRootView();
        
        // Создаем контейнер для рекламного баннера
        if (bannerContainer == null) {
            bannerContainer = new FrameLayout(this);
            FrameLayout.LayoutParams params = new FrameLayout.LayoutParams(
                FrameLayout.LayoutParams.MATCH_PARENT,
                FrameLayout.LayoutParams.WRAP_CONTENT
            );
            params.bottomMargin = 0;
            params.gravity = android.view.Gravity.BOTTOM;
            bannerContainer.setLayoutParams(params);
            bannerContainer.setId(android.R.id.content + 1);
            rootView.addView(bannerContainer);
        }

        // Создаем контейнер для нативной рекламы (для полноэкранного показа)
        if (nativeAdContainer == null) {
            nativeAdContainer = new FrameLayout(this);
            FrameLayout.LayoutParams nativeParams = new FrameLayout.LayoutParams(
                FrameLayout.LayoutParams.MATCH_PARENT,
                FrameLayout.LayoutParams.MATCH_PARENT
            );
            nativeAdContainer.setLayoutParams(nativeParams);
            nativeAdContainer.setId(android.R.id.content + 2);
            nativeAdContainer.setVisibility(android.view.View.GONE);
            rootView.addView(nativeAdContainer);
        }
    }

    public FrameLayout getBannerContainer() {
        if (bannerContainer == null) {
            ViewGroup rootView = (ViewGroup) getWindow().getDecorView().getRootView();
            bannerContainer = new FrameLayout(this);
            FrameLayout.LayoutParams params = new FrameLayout.LayoutParams(
                FrameLayout.LayoutParams.MATCH_PARENT,
                FrameLayout.LayoutParams.WRAP_CONTENT
            );
            params.bottomMargin = 0;
            params.gravity = android.view.Gravity.BOTTOM;
            bannerContainer.setLayoutParams(params);
            bannerContainer.setId(android.R.id.content + 1);
            rootView.addView(bannerContainer);
        }
        return bannerContainer;
    }

    public FrameLayout getNativeAdContainer() {
        if (nativeAdContainer == null) {
            ViewGroup rootView = (ViewGroup) getWindow().getDecorView().getRootView();
            nativeAdContainer = new FrameLayout(this);
            FrameLayout.LayoutParams nativeParams = new FrameLayout.LayoutParams(
                FrameLayout.LayoutParams.MATCH_PARENT,
                FrameLayout.LayoutParams.MATCH_PARENT
            );
            nativeAdContainer.setLayoutParams(nativeParams);
            nativeAdContainer.setId(android.R.id.content + 2);
            nativeAdContainer.setVisibility(android.view.View.GONE);
            rootView.addView(nativeAdContainer);
        }
        return nativeAdContainer;
    }
    
    public void showNativeAdContainer() {
        if (nativeAdContainer != null) {
            nativeAdContainer.setVisibility(android.view.View.VISIBLE);
            nativeAdContainer.bringToFront();
        }
    }
    
    public void hideNativeAdContainer() {
        if (nativeAdContainer != null) {
            nativeAdContainer.setVisibility(android.view.View.GONE);
        }
    }

    public void exitApp() {
        finishAffinity();
        System.exit(0);
    }
}
