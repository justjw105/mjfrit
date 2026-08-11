"use client";

import { getStorage, type FirebaseStorage } from 'firebase/storage';
import { getFirebaseApp } from './app';

/** Firebase Storage — client-only, used for admin photo uploads. */
export function getFirebaseStorage(): FirebaseStorage {
  return getStorage(getFirebaseApp());
}
