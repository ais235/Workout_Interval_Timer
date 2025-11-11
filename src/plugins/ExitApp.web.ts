import { WebPlugin } from '@capacitor/core';
import type { ExitAppPlugin } from './definitions';

export class ExitAppWeb extends WebPlugin implements ExitAppPlugin {
  async exit(): Promise<void> {
    // Fallback для веб-версии
    if (window) {
      window.close();
    }
  }
}









