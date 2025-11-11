const fs = require('fs');
const path = require('path');

const pluginsFile = path.join(__dirname, '../android/app/src/main/assets/capacitor.plugins.json');

// Читаем текущий файл
let plugins = [];
try {
  const content = fs.readFileSync(pluginsFile, 'utf8');
  plugins = JSON.parse(content);
} catch (error) {
  console.log('Creating new capacitor.plugins.json');
}

// Добавляем наши кастомные плагины, если их еще нет
const customPlugins = [
  {
    pkg: 'exit-app-plugin',
    classpath: 'com.workoutintervaltimer.rustore.ExitAppPlugin'
  },
  {
    pkg: 'vk-ads-plugin',
    classpath: 'com.workoutintervaltimer.rustore.VKAdsPlugin'
  }
];

customPlugins.forEach(customPlugin => {
  const exists = plugins.some(p => p.classpath === customPlugin.classpath);
  if (!exists) {
    plugins.push(customPlugin);
    console.log(`✅ Added plugin: ${customPlugin.classpath}`);
  }
});

// Записываем обратно
fs.writeFileSync(pluginsFile, JSON.stringify(plugins, null, 2));
console.log('✅ Plugins fixed!');

