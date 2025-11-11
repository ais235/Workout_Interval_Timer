# Инструкция по исправлению проблемы с иконками

## Почему старая иконка не обновляется?

Когда вы добавляете новые иконки в папки `mipmap-*`, Android может продолжать показывать старую иконку по следующим причинам:

### 1. **Кэш Android**
Android кэширует иконки приложения для быстрой загрузки. После замены файлов нужно:
- Удалить старое приложение с устройства/эмулятора
- Пересобрать приложение полностью

### 2. **Не все файлы обновлены**
Убедитесь, что вы заменили иконки во **всех** папках плотности:
- `mipmap-hdpi/` - для экранов с плотностью 240 dpi
- `mipmap-mdpi/` - для экранов с плотностью 160 dpi
- `mipmap-xhdpi/` - для экранов с плотностью 320 dpi
- `mipmap-xxhdpi/` - для экранов с плотностью 480 dpi
- `mipmap-xxxhdpi/` - для экранов с плотностью 640 dpi
- `mipmap-anydpi-v26/` - для адаптивных иконок (Android 8.0+)

### 3. **Адаптивные иконки (Android 8.0+)**
Для современных версий Android нужно обновить:
- `ic_launcher_adaptive_back.png` - фон иконки
- `ic_launcher_adaptive_fore.png` - передний план иконки
- Или обновить `ic_launcher_foreground.png` для круглой иконки

### 4. **Не изменен versionCode**
Если вы не меняете `versionCode` в `build.gradle`, Android может не обновить иконку.

## Что нужно сделать:

### Шаг 1: Убедитесь, что все файлы заменены
Проверьте, что новые иконки находятся во всех папках:
```
android/app/src/main/res/
├── mipmap-hdpi/
│   ├── ic_launcher.png
│   ├── ic_launcher_round.png
│   ├── ic_launcher_foreground.png
│   ├── ic_launcher_adaptive_back.png
│   └── ic_launcher_adaptive_fore.png
├── mipmap-mdpi/
│   └── (те же файлы)
├── mipmap-xhdpi/
│   └── (те же файлы)
├── mipmap-xxhdpi/
│   └── (те же файлы)
├── mipmap-xxxhdpi/
│   └── (те же файлы)
└── mipmap-anydpi-v26/
    ├── ic_launcher.xml
    └── ic_launcher_round.xml
```

### Шаг 2: Очистите кэш и пересоберите
Выполните в терминале:
```bash
cd android
./gradlew clean
./gradlew assembleDebug
```

### Шаг 3: Удалите старое приложение
**Важно!** Удалите приложение с устройства/эмулятора перед установкой новой версии.

### Шаг 4: Установите новую версию
Установите новый APK или пересоберите в Android Studio.

### Шаг 5: Если не помогло - увеличьте versionCode
Откройте `android/app/build.gradle` и увеличьте `versionCode`:
```gradle
defaultConfig {
    versionCode 2  // Было 1, теперь 2
    versionName "1.0"
}
```

### Шаг 6: Очистите кэш Android Studio
В Android Studio:
1. **File** → **Invalidate Caches / Restart**
2. Выберите **Invalidate and Restart**

## Быстрая проверка

После замены иконок выполните:
```bash
cd android
./gradlew clean
cd ..
npm run build
npm run cap:sync
```

Затем в Android Studio:
1. **Build** → **Clean Project**
2. **Build** → **Rebuild Project**
3. Удалите приложение с устройства
4. Установите заново

## Если проблема остается

1. Проверьте, что файлы действительно заменились (откройте их и убедитесь, что это ваши новые иконки)
2. Убедитесь, что имена файлов точно совпадают (регистр важен!)
3. Проверьте размеры файлов - они должны соответствовать плотности экрана
4. Попробуйте создать новый проект и скопировать иконки туда

## Рекомендуемые размеры иконок

- **mdpi**: 48x48 px
- **hdpi**: 72x72 px
- **xhdpi**: 96x96 px
- **xxhdpi**: 144x144 px
- **xxxhdpi**: 192x192 px
- **Адаптивные иконки**: 108x108 px (foreground), 432x432 px (background)











