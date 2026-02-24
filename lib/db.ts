// lib/db.ts (switchable)
import 'server-only';
import { Firestore } from '@google-cloud/firestore';

export type AppItem = {
  id: string;
  name: string;
  imageUrl: string;
  readmeUrl: string;
  appUrl: string;
  createdAt: number;
};

const USE_FIRESTORE = process.env.DATA_BACKEND === 'firestore';

function normalize(x: any): AppItem {
  return {
    id: typeof x?.id === 'string' && x.id ? x.id : crypto.randomUUID(),
    name: typeof x?.name === 'string' && x.name ? x.name : 'Untitled',
    imageUrl:
      typeof x?.imageUrl === 'string' && x.imageUrl
        ? x.imageUrl
        : '/placeholder.png',
    readmeUrl:
      typeof x?.readmeUrl === 'string' && x.readmeUrl ? x.readmeUrl : '#',
    appUrl: typeof x?.appUrl === 'string' && x.appUrl ? x.appUrl : '#',
    createdAt:
      typeof x?.createdAt === 'number' && Number.isFinite(x.createdAt)
        ? x.createdAt
        : Date.now(),
  };
}

// --- Firestore path ---
let db: Firestore | null = null;
if (USE_FIRESTORE) {
  db = new Firestore();
}
const col = db?.collection('apps');

// --- In-memory fallback (for local dev) ---
const MEM_KEY = Symbol.for('intelli_internal_ai_tools__mem_apps');
type GlobalWithMem = typeof globalThis & { [MEM_KEY]: AppItem[] };
const g = globalThis as GlobalWithMem;
if (!g[MEM_KEY]) g[MEM_KEY] = [];
const mem = () => g[MEM_KEY];

export async function listApps(): Promise<AppItem[]> {
  if (USE_FIRESTORE && col) {
    const snapshot = await col.orderBy('createdAt', 'desc').get();
    return snapshot.docs.map((d) => normalize({ id: d.id, ...d.data() }));
  }
  return mem().map(normalize);
}

export async function addApp(item: Omit<AppItem, 'id' | 'createdAt'>) {
  const app = normalize({ ...item, createdAt: Date.now() });
  if (USE_FIRESTORE && col) {
    await col.doc(app.id).set(app);
    return app;
  }
  g[MEM_KEY] = [...mem(), app];
  return app;
}

export async function deleteApp(id: string) {
  if (USE_FIRESTORE && col) {
    await col.doc(id).delete();
    return;
  }
  g[MEM_KEY] = mem().filter((x) => x.id !== id);
}

export async function updateApp(
  id: string,
  patch: Partial<Omit<AppItem, 'id' | 'createdAt'>>
): Promise<AppItem | null> {
  if (USE_FIRESTORE && col) {
    const ref = col.doc(id);
    const snap = await ref.get();
    if (!snap.exists) return null;
    const merged = normalize({ id, ...snap.data(), ...patch });
    await ref.set(merged, { merge: true });
    return merged;
  }

  const arr = mem();
  const idx = arr.findIndex((x) => x.id === id);
  if (idx === -1) return null;
  const updated = normalize({ ...arr[idx], ...patch });
  arr[idx] = updated;
  g[MEM_KEY] = [...arr];
  return updated;
}