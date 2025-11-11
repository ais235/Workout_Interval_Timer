# Инструкция по сборке релизной версии для RuStore

## 1. MyTracker SDK

SDK уже интегрирован в приложение:
- **Ключ:** `65669749871971808692`
- Скрипт добавлен в `index.html` и автоматически копируется в сборку
- SDK будет работать в собранном APK

## 2. Создание Keystore для подписи APK

Для публикации в RuStore нужен **подписанный** release APK. Создайте keystore файл:

### Вариант 1: Через Android Studio (РЕКОМЕНДУЕТСЯ)
1. Откройте Android Studio
2. Откройте проект (папка `android`)
3. **Build** → **Generate Signed Bundle / APK**
4. Выберите **APK**
5. Нажмите **Create new...** для создания нового keystore
6. Заполните форму:
   - **Key store path:** `android/workout-timer-release.keystore`
   - **Password:** `workouttimer2024` (или свой)
   - **Key alias:** `workout-timer`
   - **Key password:** `workouttimer2024` (или свой)
   - **Validity:** `10000` (или больше)
   - **Certificate:** заполните данные (можно любые)
7. Нажмите **OK** и сохраните keystore

### Вариант 2: Через командную строку
Найдите keytool (обычно в `%JAVA_HOME%\bin\keytool.exe`):
```bash
cd android
keytool -genkey -v -keystore workout-timer-release.keystore -alias workout-timer -keyalg RSA -keysize 2048 -validity 10000 -storepass workouttimer2024 -keypass workouttimer2024 -dname "CN=Workout Timer, OU=Development, O=Workout Timer, L=Moscow, ST=Moscow, C=RU"
```

**ВАЖНО:** Сохраните keystore файл и пароли в безопасном месте! Они понадобятся для всех будущих обновлений приложения.

## 3. Настройка keystore.properties

Файл `android/keystore.properties` уже создан с настройками:
```
MYAPP_RELEASE_STORE_FILE=workout-timer-release.keystore
MYAPP_RELEASE_KEY_ALIAS=workout-timer
MYAPP_RELEASE_STORE_PASSWORD=workouttimer2024
MYAPP_RELEASE_KEY_PASSWORD=workouttimer2024
```

**ВАЖНО:** Если вы использовали другие пароли при создании keystore, обновите этот файл!

## 4. Сборка Release APK

### Через командную строку:
```bash
cd android
./gradlew.bat assembleRelease
```

### Через Android Studio:
1. **Build** → **Build Bundle(s) / APK(s)** → **Build APK(s)**
2. Выберите **release** вариант

## 5. Расположение APK

После сборки APK будет находиться в:
```
android/app/build/outputs/apk/release/app-release.apk
```
(если keystore настроен и файл существует)

или
```
android/app/build/outputs/apk/release/app-release-unsigned.apk
```
(если keystore не настроен)

**ВАЖНО:** Для RuStore нужен **ПОДПИСАННЫЙ** APK (`app-release.apk`)! 
Создайте keystore и пересоберите для получения подписанного файла.

## 6. Загрузка в RuStore

1. Войдите в личный кабинет RuStore
2. Создайте новое приложение или выберите существующее
3. Загрузите **подписанный** `app-release.apk`
4. Заполните все необходимые данные (описание, скриншоты, иконки)
5. Отправьте на модерацию

## Примечания

- **Keystore файл** (`workout-timer-release.keystore`) - это критически важный файл! Сохраните его в безопасном месте.
- **Пароли** от keystore также нужно сохранить - они понадобятся для всех будущих обновлений приложения.
- **Не коммитьте** `keystore.properties` и `*.keystore` в git (добавьте в .gitignore)
- MyTracker SDK автоматически включен в сборку и будет работать в релизной версии
