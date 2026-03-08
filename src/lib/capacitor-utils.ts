import { Capacitor } from '@capacitor/core';
import { Browser } from '@capacitor/browser';

/**
 * Opens an external URL using the appropriate method for the platform.
 * On native (Capacitor), uses the Browser plugin which properly handles
 * external app intents (WhatsApp, PDF viewers, etc.).
 * On web, uses regular window.open.
 */
export async function openExternalUrl(url: string): Promise<void> {
  if (Capacitor.isNativePlatform()) {
    await Browser.open({ url });
  } else {
    window.open(url, '_blank');
  }
}
