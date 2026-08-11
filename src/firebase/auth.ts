"use client";

import { getAuth, type Auth } from 'firebase/auth';
import { getFirebaseApp } from './app';

/** Firebase Auth — client-only (relies on browser storage for session persistence). */
export function getFirebaseAuth(): Auth {
  return getAuth(getFirebaseApp());
}

/**
 * The single admin account allowed to sign in to /admin. Firestore and
 * Storage security rules enforce this same email server-side, so this
 * client-side check is a UX convenience, not the real security boundary.
 */
export const ADMIN_EMAIL = 'moriahguy@gmail.com';
