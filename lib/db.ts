// lib/db.ts (switchable, Cloud Run + local dev)
import 'server-only';
import { Firestore } from '@google-cloud/firestore';

export type AppItem = {
  id: string;
  name: string;
  imageUrl: string;
  readmeUrl: string;
  appUrl: string;
  createdAt: number; // epoch ms
};

// -----------------------------
// Backend switch
// -----------------------------
const DATA_BACKEND = (process.env.DATA_BACKEND || '').toLowerCase();
const USE_FIRESTORE = DATA_BACKEND === 'firestore';

// Resolve the GCP project (Cloud Run injects GOOGLE_CLOUD_PROJECT)
const resolvedProjectId =
  process.env.FIRESTORE_PROJECT_ID ||
  process.env.GOOGLE_CLOUD_PROJECT ||
  process.env.GCLOUD_PROJECT ||
  undefined;

// Initialize Firestore only when needed
let db: Firestore | null = null;
let col: FirebaseFirestore.CollectionReference | null = null;

if (USE_FIRESTORE) {
  db = resolvedProjectId ? new Firestore({ projectId: resolvedProjectId }) : new Firestore();
  col = db.collection('apps');
  console.log('[Storage] Firestore enabled. Project:', resolvedProjectId || '(ADC default)');
} else {
  console.log('[Storage] In-memory store (non-persistent). Set DATA_BACKEND=firestore for persistence.');
}

// -----------------------------
// In-memory store (shared across modules/HMR)
// -----------------------------
const MEM_KEY = Symbol.for('intelli_internal_ai_tools__mem_apps');
type GlobalWithMem = typeof globalThis & { [MEM_KEY]: AppItem[] };
const g = globalThis as GlobalWithMem;
if (!g[MEM_KEY]) g[MEM_KEY] = [];
const mem = () => g[MEM_KEY];

// -----------------------------
// Helpers
// -----------------------------
function normalize(x: any): AppItem {
  return {
    id: typeof x?.id === 'string' && x.id ? x.id : crypto.randomUUID(),
    name: typeof x?.name === 'string' && x.name ? x.name : 'Untitled',
    imageUrl:
      typeof x?.imageUrl === 'string' && x.imageUrl ? x.imageUrl : '/placeholder.png',
    readmeUrl:
      typeof x?.readmeUrl === 'string' && x.readmeUrl ? x.readmeUrl : '#',
    appUrl:
      typeof x?.appUrl === 'string' && x.appUrl ? x.appUrl : '#',
    createdAt:
      typeof x?.createdAt === 'number' && Number.isFinite(x.createdAt)
        ? x.createdAt
        : Date.now(),
  };
}

// -----------------------------
// Public API
// -----------------------------
export async function listApps(): Promise<AppItem[]> {
  if (USE_FIRESTORE && col) {
    try {
      // Single-field orderBy requires no composite index.
      const snapshot = await col.orderBy('createdAt', 'desc').get();
      return snapshot.docs.map((d) => normalize({ id: d.id, ...d.data() }));
    } catch (e: any) {
      console.error(
        '[Firestore:listApps] project:',
        resolvedProjectId,
        'code:',
        e?.code,
        'message:',
        e?.message
      );
      throw e;
    }
  }
  return mem().map(normalize).sort((a, b) => b.createdAt - a.createdAt);
}

export async function addApp(item: Omit<AppItem, 'id' | 'createdAt'>) {
  const app = normalize({ ...item, createdAt: Date.now() });
  if (USE_FIRESTORE && col) {
    try {
      await col.doc(app.id).set(app);
      return app;
    } catch (e: any) {
      console.error(
        '[Firestore:addApp] project:',
        resolvedProjectId,
        'id:',
        app.id,
        'code:',
        e?.code,
        'message:',
        e?.message
      );
      throw e;
    }
  }
  g[MEM_KEY] = [...mem(), app];
  return app;
}

export async function deleteApp(id: string) {
  if (USE_FIRESTORE && col) {
    try {
      await col.doc(id).delete();
      return;
    } catch (e: any) {
      console.error(
        '[Firestore:deleteApp] project:',
        resolvedProjectId,
        'id:',
        id,
        'code:',
        e?.code,
        'message:',
        e?.message
      );
      throw e;
    }
  }
  g[MEM_KEY] = mem().filter((x) => x.id !== id);
}

export async function updateApp(
  id: string,
  patch: Partial<Omit<AppItem, 'id' | 'createdAt'>>
): Promise<AppItem | null> {
  if (USE_FIRESTORE && col) {
    try {
      const ref = col.doc(id);
      const snap = await ref.get();
      if (!snap.exists) return null;
      const merged = normalize({ id, ...snap.data(), ...patch });
      await ref.set(merged, { merge: true });
      return merged;
    } catch (e: any) {
      console.error(
        '[Firestore:updateApp] project:',
        resolvedProjectId,
        'id:',
        id,
        'code:',
        e?.code,
        'message:',
        e?.message
      );
      throw e;
    }
  }

  const arr = mem();
  const idx = arr.findIndex((x) => x.id === id);
  if (idx === -1) return null;
  const updated = normalize({ ...arr[idx], ...patch });
  arr[idx] = updated;
  g[MEM_KEY] = [...arr];
  return updated;
}

// Optional: visibility into active mode
export function getStorageMode(): 'firestore' | 'memory' {
  return USE_FIRESTORE ? 'firestore' : 'memory';
}