# Add project specific ProGuard rules here.
# You can control the set of applied configuration files using the
# proguardFiles setting in build.gradle.
#
# For more details, see
#   http://developer.android.com/guide/developing/tools/proguard.html

# If your project uses WebView with JS, uncomment the following
# and specify the fully qualified class name to the JavaScript interface
# class:
#-keepclassmembers class fqcn.of.javascript.interface.for.webview {
#   public *;
#}

# Uncomment this to preserve the line number information for
# debugging stack traces.
#-keepattributes SourceFile,LineNumberTable

# If you keep the line number information, uncomment this to
# hide the original source file name.
#-renamesourcefileattribute SourceFile

# ===== CAPACITOR PLUGINS =====
# Сохраняем все Capacitor Plugin классы
-keep public class * extends com.getcapacitor.Plugin
-keep public class com.getcapacitor.** { *; }

# Сохраняем аннотации Capacitor
-keepattributes *Annotation*
-keep @com.getcapacitor.annotation.CapacitorPlugin class * { *; }

# Сохраняем наши кастомные плагины
-keep class com.workoutintervaltimer.rustore.ExitAppPlugin { *; }
-keep class com.workoutintervaltimer.rustore.VKAdsPlugin { *; }

# Сохраняем методы с аннотацией @PluginMethod
-keepclassmembers class * extends com.getcapacitor.Plugin {
    @com.getcapacitor.annotation.CapacitorPlugin <methods>;
    @com.getcapacitor.PluginMethod <methods>;
}

# VK Ads SDK
-keep class com.my.target.** { *; }
-dontwarn com.my.target.**
