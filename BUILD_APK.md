# Инструкция по сборке APK

## Анализ проекта

Проект **Workout Interval Timer** - это веб-приложение на React + Vite для таймера тренировок с интервалами. 

### Технологии:
- **React 19.2.0** - UI библиотека
- **Vite 6.2.0** - сборщик
- **TypeScript** - типизация
- **Tailwind CSS** - стили (через CDN)
- **Capacitor 7.4.4** - для конвертации в мобильное приложение

### Функциональность:
- Таймер тренировок с интервалами
- Отслеживание подходов и времени отдыха
- История тренировок с календарем
- Многоязычная поддержка (EN, ES, RU)
- Настройки звука (бип или голос)
- Сохранение тренировок в localStorage

## Что уже сделано:

1. ✅ Установлен Capacitor и Android платформа
2. ✅ Инициализирован Capacitor с конфигурацией
3. ✅ Добавлена Android платформа
4. ✅ Настроена конфигурация для Android
5. ✅ Собрано веб-приложение
6. ✅ Синхронизировано с Android проектом

## Сборка APK файла

### Вариант 1: Через Android Studio (Рекомендуется)

1. **Установите Android Studio** (если еще не установлен):
   - Скачайте с https://developer.android.com/studio
   - Установите Android SDK и необходимые инструменты

2. **Откройте проект в Android Studio**:
   ```bash
   npm run cap:open
   ```
   Или откройте папку `android` в Android Studio вручную.

3. **Соберите APK**:
   - В Android Studio: `Build` → `Build Bundle(s) / APK(s)` → `Build APK(s)`
   - Или используйте меню: `Build` → `Generate Signed Bundle / APK`

4. **APK будет находиться в**:
   ```
   android/app/build/outputs/apk/debug/app-debug.apk
   ```

### Вариант 2: Через командную строку (Gradle)

**Требования:**
- Установлен Android SDK
- Установлен Java JDK (версия 11 или выше)
- Переменные окружения настроены правильно

**Команды:**

```bash
# Из корня проекта
cd android

# Для Windows (CMD или PowerShell)
gradlew.bat assembleDebug

# Для Linux/Mac
./gradlew assembleDebug
```

**APK будет в:**
```
android/app/build/outputs/apk/debug/app-debug.apk
```

### Вариант 3: Использование готовых скриптов

```bash
# Собрать веб-приложение и синхронизировать с Android
npm run cap:sync

# Открыть Android Studio
npm run cap:open

# Затем в Android Studio: Build → Build APK(s)
```

## Создание подписанного APK (для публикации)

Для публикации в Google Play Store нужно создать подписанный APK:

1. Создайте keystore:
   ```bash
   keytool -genkey -v -keystore workout-timer-release-key.jks -keyalg RSA -keysize 2048 -validity 10000 -alias workout-timer
   ```

2. Настройте `android/app/build.gradle` для использования keystore

3. Соберите release APK:
   ```bash
   cd android
   gradlew.bat assembleRelease
   ```

## Структура проекта

```
Workout_Interval_Timer/
├── android/              # Android проект (Capacitor)
│   └── app/
│       └── build/
│           └── outputs/
│               └── apk/   # Здесь будет APK файл
├── dist/                 # Собранное веб-приложение
├── src/                  # Исходный код
├── capacitor.config.ts   # Конфигурация Capacitor
└── package.json          # Зависимости проекта
```

## Важные файлы конфигурации

- `capacitor.config.ts` - настройки Capacitor
- `android/app/build.gradle` - настройки Android сборки
- `android/app/src/main/AndroidManifest.xml` - манифест Android приложения

## Примечания

- APK файл будет находиться в `android/app/build/outputs/apk/debug/` после успешной сборки
- Для тестирования на устройстве можно использовать `adb install app-debug.apk`
- Размер APK будет примерно 10-15 МБ (включая React и все зависимости)
- Приложение будет работать офлайн, так как использует localStorage

## Решение проблем

Если возникают ошибки при сборке:

1. Убедитесь, что Android SDK установлен и настроен
2. Проверьте версию Java (нужна JDK 11+)
3. Убедитесь, что все зависимости установлены: `npm install`
4. Очистите кэш Gradle: `cd android && gradlew.bat clean`
5. Пересоберите: `npm run cap:sync && npm run cap:open`

