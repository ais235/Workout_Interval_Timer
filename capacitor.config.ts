import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.workoutintervaltimer.rustore',
  appName: 'Workout Interval Timer',
  webDir: 'dist',
  android: {
    allowMixedContent: true,
    buildOptions: {
      keystorePath: undefined,
      keystoreAlias: undefined,
    }
  },
  server: {
    androidScheme: 'https'
  }
};

export default config;
