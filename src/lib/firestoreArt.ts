import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  getDoc,
  query,
  orderBy,
  where,
  onSnapshot,
  writeBatch,
  type Unsubscribe,
} from 'firebase/firestore';
import { getDb } from '@/firebase/firestore';
import type { ArtPiece } from './artdata';

const COLLECTION = 'artPieces';

/** Firestore documents don't carry the `id` field (that's the doc id). */
export type ArtPieceInput = Omit<ArtPiece, 'id'>;
export type ArtPieceDoc = ArtPieceInput & { docId: string };

function docToArtPieceDoc(d: { id: string; data: () => any }): ArtPieceDoc {
  const data = d.data();
  return {
    docId: d.id,
    slug: data.slug ?? '',
    title: data.title ?? '',
    imageUrl: data.imageUrl ?? '',
    imageHint: data.imageHint ?? '',
    description: data.description ?? '',
    technicalDetails: data.technicalDetails ?? '',
    price: typeof data.price === 'number' ? data.price : 0,
    size: data.size ?? '',
    framedSize: data.framedSize,
    unframedSize: data.unframedSize,
    alt: data.alt ?? '',
    updatedAt: data.updatedAt ?? new Date().toISOString().slice(0, 10),
    order: typeof data.order === 'number' ? data.order : 0,
    sold: !!data.sold,
    visible: data.visible !== false,
  };
}

/** All pieces, ordered for the admin dashboard (includes hidden/sold). */
export async function getAllArtPieceDocs(): Promise<ArtPieceDoc[]> {
  const db = getDb();
  const snap = await getDocs(query(collection(db, COLLECTION), orderBy('order', 'asc')));
  return snap.docs.map((d) => docToArtPieceDoc(d));
}

/** Live subscription to all pieces, for the admin dashboard. */
export function subscribeToAllArtPieces(
  onChange: (pieces: ArtPieceDoc[]) => void
): Unsubscribe {
  const db = getDb();
  const q = query(collection(db, COLLECTION), orderBy('order', 'asc'));
  return onSnapshot(q, (snap) => {
    onChange(snap.docs.map((d) => docToArtPieceDoc(d)));
  });
}

/** Public gallery pieces only (visible === true), ordered for display. */
export async function getVisibleArtPieceDocs(): Promise<ArtPieceDoc[]> {
  const all = await getAllArtPieceDocs();
  return all.filter((p) => p.visible !== false);
}

/** Live subscription to visible pieces only, for the public gallery page. */
export function subscribeToVisibleArtPieces(
  onChange: (pieces: ArtPieceDoc[]) => void
): Unsubscribe {
  return subscribeToAllArtPieces((pieces) => {
    onChange(pieces.filter((p) => p.visible !== false));
  });
}

/** Look up a single piece by its public slug (used by the art piece detail page). */
export async function getArtPieceBySlug(slug: string): Promise<ArtPieceDoc | null> {
  const db = getDb();
  const snap = await getDocs(query(collection(db, COLLECTION), where('slug', '==', slug)));
  if (snap.empty) return null;
  return docToArtPieceDoc(snap.docs[0]);
}

export async function createArtPiece(piece: ArtPieceInput): Promise<string> {
  const db = getDb();
  const ref = await addDoc(collection(db, COLLECTION), piece);
  return ref.id;
}

export async function updateArtPiece(
  docId: string,
  updates: Partial<ArtPieceInput>
): Promise<void> {
  const db = getDb();
  await updateDoc(doc(db, COLLECTION, docId), {
    ...updates,
    updatedAt: new Date().toISOString().slice(0, 10),
  });
}

export async function deleteArtPiece(docId: string): Promise<void> {
  const db = getDb();
  await deleteDoc(doc(db, COLLECTION, docId));
}

/** Persist a new relative ordering for a set of pieces (drag-and-drop reorder). */
export async function reorderArtPieces(orderedDocIds: string[]): Promise<void> {
  const db = getDb();
  const batch = writeBatch(db);
  orderedDocIds.forEach((docId, index) => {
    batch.update(doc(db, COLLECTION, docId), { order: index + 1 });
  });
  await batch.commit();
}

/** True if the artPieces collection has never been populated yet. */
export async function isGalleryEmpty(): Promise<boolean> {
  const db = getDb();
  const snap = await getDocs(query(collection(db, COLLECTION)));
  return snap.empty;
}

/** One-time import of the legacy static gallery data into Firestore. */
export async function seedGalleryFromStaticData(pieces: ArtPiece[]): Promise<void> {
  const db = getDb();
  const batch = writeBatch(db);
  pieces.forEach((piece) => {
    const { id, ...rest } = piece;
    const ref = doc(collection(db, COLLECTION));
    batch.set(ref, rest);
  });
  await batch.commit();
}
