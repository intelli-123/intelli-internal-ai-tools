'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { AppItem } from '../lib/db';

type SafeApp = Partial<AppItem> & { id?: string };

export default function AppCard({
  app,
  showDelete = false,
}: {
  app: SafeApp;
  showDelete?: boolean;
}) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const id = app?.id ?? '';
  const name = app?.name?.trim() || 'Untitled';
  const imageUrl = app?.imageUrl?.trim() || '/placeholder.png';
  const appUrl = app?.appUrl?.trim() || '#';
  const readmeUrl = app?.readmeUrl?.trim() || '#';

  async function handleDelete() {
    if (!showDelete || !id) return;
    if (!confirm(`Delete "${name}"?`)) return;

    setErr(null);
    setDeleting(true);

    try {
      const res = await fetch(`/api/apps/${id}`, { method: 'DELETE' });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Failed to delete');
      }
      router.refresh();
    } catch (e: any) {
      setErr(e.message);
    } finally {
      setDeleting(false);
    }
  }

  return (
    <article className="rounded-lg border border-zinc-800 bg-[var(--card)] p-4 shadow-md">
      {/* Image wrapper with actual height */}
      <div className="relative w-full aspect-video overflow-hidden rounded-md bg-black/30">
        <img
          src={imageUrl}
          alt={name}
          className="object-cover w-full h-full"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src = '/placeholder.png';
          }}
        />
      </div>

      <h3 className="mt-3 text-base font-semibold text-[var(--fg)]">
        {name}
      </h3>

      <div className="flex gap-4 mt-2 text-sm">
        <a
          href={appUrl}
          target="_blank"
          rel="noreferrer"
          className="text-indigo-400 hover:underline"
        >
          Open App
        </a>
        <a
          href={readmeUrl}
          target="_blank"
          rel="noreferrer"
          className="text-zinc-400 hover:underline"
        >
          README
        </a>
      </div>

      {showDelete && id && (
        <button
          className="mt-3 text-red-400 text-sm hover:underline disabled:opacity-50"
          onClick={handleDelete}
          disabled={deleting}
        >
          {deleting ? 'Deleting…' : 'Delete'}
        </button>
      )}

      {err && (
        <p className="text-red-500 text-xs mt-1">{err}</p>
      )}
    </article>
  );
}