// components/AppTable.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { AppItem } from '../lib/db';
import { AppForm } from './AppForm';

export default function AppTable({ apps }: { apps: AppItem[] }) {
  const router = useRouter();
  const [editing, setEditing] = useState<AppItem | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  async function handleDelete(id: string, name: string) {
    if (!confirm(`Delete "${name}"?`)) return;
    setErr(null);
    setDeletingId(id);
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
      setDeletingId(null);
    }
  }

  return (
    <>
      {editing && (
        <div className="card" style={{ marginBottom: '1rem' }}>
          <h3>Edit “{editing.name}”</h3>
          <AppForm
            mode="edit"
            initial={editing}
            onDone={() => {
              setEditing(null);
              router.refresh();
            }}
            onCancel={() => setEditing(null)}
          />
        </div>
      )}

      {err && <p className="error">{err}</p>}

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ textAlign: 'left' }}>
              <th>Image</th>
              <th>Name</th>
              <th>App URL</th>
              <th>README URL</th>
              <th style={{ width: 160 }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {apps.map((a) => (
              <tr key={a.id} style={{ borderTop: '1px solid #222' }}>
                <td style={{ padding: '8px' }}>
                  <img
                    src={a.imageUrl}
                    alt={a.name}
                    width={72}
                    height={40}
                    style={{ objectFit: 'cover', borderRadius: 6, border: '1px solid #222' }}
                    onError={(e) => ((e.currentTarget.src = '/placeholder.png'))}
                  />
                </td>
                <td style={{ padding: '8px' }}>{a.name}</td>
                <td style={{ padding: '8px' }}>
                  <a href={a.appUrl} target="_blank" rel="noreferrer">{a.appUrl}</a>
                </td>
                <td style={{ padding: '8px' }}>
                  <a href={a.readmeUrl} target="_blank" rel="noreferrer">{a.readmeUrl}</a>
                </td>
                <td style={{ padding: '8px' }}>
                  <button onClick={() => setEditing(a)} style={{ marginRight: 8 }}>Edit</button>
                  <button
                    className="danger"
                    onClick={() => handleDelete(a.id, a.name)}
                    disabled={deletingId === a.id}
                  >
                    {deletingId === a.id ? 'Deleting…' : 'Delete'}
                  </button>
                </td>
              </tr>
            ))}
            {apps.length === 0 && (
              <tr>
                <td colSpan={5} style={{ padding: '12px', color: 'var(--muted)' }}>
                  No apps yet. Use the form above to add your first tool.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}