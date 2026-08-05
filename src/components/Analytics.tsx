"use client";

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { initializeApp, getApps } from 'firebase/app';
import {
  getAnalytics,
  isSupported,
  logEvent,
  setCurrentScreen,
  type Analytics as FirebaseAnalytics,
} from 'firebase/analytics';
import { firebaseConfig } from '@/firebase/config';

export function Analytics() {
  const pathname = usePathname();
  const analyticsRef = useRef<FirebaseAnalytics | null>(null);
  const isFirstLoad = useRef(true);

  // Initialize Firebase Analytics once.
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

    isSupported()
      .then((supported) => {
        if (supported) {
          analyticsRef.current = getAnalytics(app);
        }
      })
      .catch((err) => {
        console.error('Firebase analytics initialization error:', err);
      });
  }, []);

  // Log a page_view on every route change (client-side navigations don't
  // trigger GA's automatic page_view, since there's no full page reload).
  useEffect(() => {
    if (typeof window === 'undefined' || !pathname) return;

    // Skip the very first render: the automatic initial page_view from
    // GA's own initialization already covers it, avoiding a duplicate.
    if (isFirstLoad.current) {
      isFirstLoad.current = false;
      return;
    }

    const fullPath = window.location.pathname + window.location.search;

    const send = (analytics: FirebaseAnalytics) => {
      logEvent(analytics, 'page_view', {
        page_path: fullPath,
        page_location: window.location.href,
        page_title: document.title,
      });
      setCurrentScreen(analytics, fullPath);
    };

    if (analyticsRef.current) {
      send(analyticsRef.current);
    } else {
      // Analytics may not be initialized yet on very fast navigations.
      isSupported()
        .then((supported) => {
          if (!supported) return;
          const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
          const analytics = getAnalytics(app);
          analyticsRef.current = analytics;
          send(analytics);
        })
        .catch(() => {});
    }
  }, [pathname]);

  return null;
}
