import { registerPlugin } from '@capacitor/core';
import type { ExitAppPlugin } from './definitions';

const ExitApp = registerPlugin<ExitAppPlugin>('ExitApp', {
  web: () => import('./ExitApp.web').then(m => new m.ExitAppWeb()),
});

export * from './definitions';
export { ExitApp };

