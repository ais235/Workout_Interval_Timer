# Проверка паролей keystore

Если сборка выдаёт ошибку "keystore password was incorrect", значит пароли в `keystore.properties` не совпадают с теми, что вы указали при создании keystore в Android Studio.

## Решение:

1. Вспомните пароли, которые вы указали при создании keystore в Android Studio
2. Обновите файл `android/keystore.properties` с правильными паролями:

```
MYAPP_RELEASE_STORE_FILE=workout-timer-release.keystore
MYAPP_RELEASE_KEY_ALIAS=workout-timer
MYAPP_RELEASE_STORE_PASSWORD=ВАШ_ПАРОЛЬ_ОТ_KEYSTORE
MYAPP_RELEASE_KEY_PASSWORD=ВАШ_ПАРОЛЬ_ОТ_КЛЮЧА
```

3. Пересоберите APK:
```bash
cd android
./gradlew.bat clean assembleRelease
```

## Если забыли пароли:

Придётся создать новый keystore:
1. Удалите старый: `android/workout-timer-release.keystore`
2. Создайте новый через Android Studio
3. Обновите `keystore.properties` с новыми паролями






