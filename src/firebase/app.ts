import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app';
import { firebaseConfig } from './config';

/**
 * Returns a singleton Firebase app instance. Safe to call from both
 * server components (Node runtime) and client components — firebase/app
 * and firebase/firestore have no browser-only dependencies.
 */
export function getFirebaseApp(): FirebaseApp {
  return getApps().length ? getApp() : initializeApp(firebaseConfig);
}
