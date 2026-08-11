import { getFirestore, type Firestore } from 'firebase/firestore';
import { getFirebaseApp } from './app';

/**
 * Firestore instance. Works in both server components (Node) and client
 * components — reads/writes go over the same public REST/gRPC surface and
 * are governed by Firestore Security Rules, not by any server credential.
 */
export function getDb(): Firestore {
  return getFirestore(getFirebaseApp());
}
