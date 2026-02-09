// lib/db.ts
import 'server-only';

export type AppItem = {
  id: string;
  name: string;
  imageUrl: string;
  readmeUrl: string;
  appUrl: string;
  createdAt: number;
};

// Detect KV availability
const USING_KV =
  !!process.env.KV_REST_API_URL && !!process.env.KV_REST_API_TOKEN;

let kv: any = null;
if (USING_KV) {
  kv = require('@vercel/kv').kv;
}

const KEY = 'apps:list:v1';

// --------- GLOBAL in-memory store to survive HMR & share across routes ---------
const MEM_KEY = Symbol.for('intelli_internal_ai_tools__mem_apps');

type GlobalWithMem = typeof globalThis & { [MEM_KEY]: AppItem[] };

const g = globalThis as GlobalWithMem;
if (!g[MEM_KEY]) g[MEM_KEY] = [];

function mem(): AppItem[] {
  return g[MEM_KEY];
}

// --------- Normalizer to keep UI safe even if some fields are missing ----------
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

// --------- Public API ----------------------------------------------------------
export async function listApps(): Promise<AppItem[]> {
  if (USING_KV) {
    const rows = await kv.lrange(KEY, 0, -1);
    return (rows as string[]).map((s) => normalize(JSON.parse(s)));
  }
  return mem().map(normalize);
}

export async function addApp(item: Omit<AppItem, 'id' | 'createdAt'>) {
  const app: AppItem = {
    ...item,
    id: crypto.randomUUID(),
    createdAt: Date.now(),
  };
  if (USING_KV) {
    await kv.rpush(KEY, JSON.stringify(app));
    return app;
  }
  g[MEM_KEY] = [...mem(), app];
  return app;
}

export async function deleteApp(id: string) {
  if (USING_KV) {
    const all = await listApps();
    const filtered = all.filter((x) => x.id !== id);
    await kv.del(KEY);
    if (filtered.length) {
      await kv.rpush(KEY, ...filtered.map((x) => JSON.stringify(x)));
    }
    return;
  }
  g[MEM_KEY] = mem().filter((x) => x.id !== id);
}

export async function updateApp(
  id: string,
  patch: Partial<Omit<AppItem, 'id' | 'createdAt'>>
): Promise<AppItem | null> {
  if (USING_KV) {
    const all = await listApps();
    let updated: AppItem | null = null;
    const next = all.map((x) => {
      if (x.id === id) {
        updated = normalize({ ...x, ...patch });
        return updated!;
      }
      return x;
    });
    if (!updated) return null;
    await kv.del(KEY);
    if (next.length) {
      await kv.rpush(KEY, ...next.map((x) => JSON.stringify(x)));
    }
    return updated;
  }

  const arr = mem();
  const idx = arr.findIndex((x) => x.id === id);
  if (idx === -1) return null;
  const updated = normalize({ ...arr[idx], ...patch });
  arr[idx] = updated;
  g[MEM_KEY] = [...arr];
  return updated;
}