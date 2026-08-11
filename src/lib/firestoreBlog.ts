import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  query,
  where,
  onSnapshot,
  type Unsubscribe,
} from 'firebase/firestore';
import { getDb } from '@/firebase/firestore';

const COLLECTION = 'blogPosts';

export type BlogPostInput = {
  slug: string;
  title: string;
  excerpt: string;
  /** Markdown source. */
  content: string;
  coverImageUrl: string;
  coverImageHint: string;
  tags: string[];
  author: string;
  published: boolean;
  /** ISO date (YYYY-MM-DD). Set the first time a post is published. */
  publishedAt: string;
  /** ISO date (YYYY-MM-DD). Bumped on every save. */
  updatedAt: string;
};

export type BlogPostDoc = BlogPostInput & { docId: string };

function docToBlogPostDoc(d: { id: string; data: () => any }): BlogPostDoc {
  const data = d.data();
  return {
    docId: d.id,
    slug: data.slug ?? '',
    title: data.title ?? '',
    excerpt: data.excerpt ?? '',
    content: data.content ?? '',
    coverImageUrl: data.coverImageUrl ?? '',
    coverImageHint: data.coverImageHint ?? '',
    tags: Array.isArray(data.tags) ? data.tags : [],
    author: data.author ?? 'Moriah Jane',
    published: !!data.published,
    publishedAt: data.publishedAt ?? '',
    updatedAt: data.updatedAt ?? new Date().toISOString().slice(0, 10),
  };
}

function sortByPublishedDateDesc(posts: BlogPostDoc[]): BlogPostDoc[] {
  return [...posts].sort((a, b) => (b.publishedAt || '').localeCompare(a.publishedAt || ''));
}

/** All posts (drafts + published), for the admin dashboard. */
export async function getAllBlogPostDocs(): Promise<BlogPostDoc[]> {
  const db = getDb();
  const snap = await getDocs(collection(db, COLLECTION));
  return sortByPublishedDateDesc(snap.docs.map((d) => docToBlogPostDoc(d)));
}

/** Live subscription to all posts, for the admin dashboard. */
export function subscribeToAllBlogPosts(
  onChange: (posts: BlogPostDoc[]) => void
): Unsubscribe {
  const db = getDb();
  return onSnapshot(collection(db, COLLECTION), (snap) => {
    onChange(sortByPublishedDateDesc(snap.docs.map((d) => docToBlogPostDoc(d))));
  });
}

/** Published posts only, newest first — for the public /blog list. */
export async function getPublishedBlogPostDocs(): Promise<BlogPostDoc[]> {
  const all = await getAllBlogPostDocs();
  return all.filter((p) => p.published);
}

/** Look up a single published post by slug. Returns null for drafts/missing. */
export async function getBlogPostBySlug(slug: string): Promise<BlogPostDoc | null> {
  const db = getDb();
  const snap = await getDocs(query(collection(db, COLLECTION), where('slug', '==', slug)));
  if (snap.empty) return null;
  const post = docToBlogPostDoc(snap.docs[0]);
  return post.published ? post : null;
}

export async function createBlogPost(post: BlogPostInput): Promise<string> {
  const db = getDb();
  const ref = await addDoc(collection(db, COLLECTION), post);
  return ref.id;
}

export async function updateBlogPost(
  docId: string,
  updates: Partial<BlogPostInput>
): Promise<void> {
  const db = getDb();
  await updateDoc(doc(db, COLLECTION, docId), {
    ...updates,
    updatedAt: new Date().toISOString().slice(0, 10),
  });
}

export async function deleteBlogPost(docId: string): Promise<void> {
  const db = getDb();
  await deleteDoc(doc(db, COLLECTION, docId));
}
