"use client";

import { useEffect } from 'react';
import { initializeApp, getApps } from 'firebase/app';
import { getAnalytics, isSupported } from 'firebase/analytics';
import { firebaseConfig } from '@/firebase/config';

export function Analytics() {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (getApps().length === 0) {
        const app = initializeApp(firebaseConfig);
        isSupported().then((supported) => {
          if (supported) {
            getAnalytics(app);
          }
        }).catch((err) => {
          console.error("Firebase analytics initialization error:", err);
        });
      }
    }
  }, []);

  return null;
}
