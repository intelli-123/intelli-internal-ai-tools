// components/AppCard.tsx
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

  // Defensive defaults (prevents "reading 'imageUrl' of undefined")
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
    <article className="card">
      <img
        src={imageUrl}
        alt={name}
        className="thumb"
        onError={(e) => { e.currentTarget.src = '/placeholder.png'; }}
      />
      <h3>{name}</h3>
      <div className="links">
        <a href={appUrl} target="_blank" rel="noreferrer">Open App</a>
        <a href={readmeUrl} target="_blank" rel="noreferrer">README</a>
      </div>
      {showDelete && id && (
        <button className="danger" onClick={handleDelete} disabled={deleting}>
          {deleting ? 'Deleting…' : 'Delete'}
        </button>
      )}
      {err && <p className="error">{err}</p>}
    </article>
  );
}
