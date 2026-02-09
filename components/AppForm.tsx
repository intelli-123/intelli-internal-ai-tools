// components/AppForm.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { AppItem } from '../lib/db';

type FormState = {
  name: string;
  imageUrl: string;
  readmeUrl: string;
  appUrl: string;
};

export function AppForm({
  mode = 'create',
  initial,
  onDone,
  onCancel,
}: {
  mode?: 'create' | 'edit';
  initial?: AppItem;
  onDone?: () => void;
  onCancel?: () => void;
}) {
  const router = useRouter();
  const [form, setForm] = useState<FormState>({
    name: initial?.name ?? '',
    imageUrl: initial?.imageUrl ?? '',
    readmeUrl: initial?.readmeUrl ?? '',
    appUrl: initial?.appUrl ?? '',
  });
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  function update<K extends keyof FormState>(k: K, v: string) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);
    setErr(null);
    setBusy(true);
    try {
      const endpoint = mode === 'create' ? '/api/apps' : `/api/apps/${initial!.id}`;
      const method = mode === 'create' ? 'POST' : 'PUT';
      const res = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || `Failed to ${mode}`);
      }
      if (mode === 'create') {
        setMsg('Added! Check Home page.');
        setForm({ name: '', imageUrl: '', readmeUrl: '', appUrl: '' });
      } else {
        setMsg('Updated!');
      }
      // If parent didn't provide a callback, refresh the page to reload server data
      if (onDone) onDone();
      else router.refresh();
    } catch (e: any) {
      setErr(e.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <form className="card form" onSubmit={handleSubmit}>
      <h3>{mode === 'create' ? 'Add a Tool' : 'Edit Tool'}</h3>
      <label>
        App Name
        <input value={form.name} onChange={(e) => update('name', e.target.value)} required />
      </label>
      <label>
        Image URL
        <input type="url" value={form.imageUrl} onChange={(e) => update('imageUrl', e.target.value)} required />
      </label>
      <label>
        README URL
        <input type="url" value={form.readmeUrl} onChange={(e) => update('readmeUrl', e.target.value)} required />
      </label>
      <label>
        App URL
        <input type="url" value={form.appUrl} onChange={(e) => update('appUrl', e.target.value)} required />
      </label>
      <div style={{ display: 'flex', gap: 8 }}>
        <button type="submit" disabled={busy}>
          {busy ? (mode === 'create' ? 'Adding…' : 'Saving…') : (mode === 'create' ? 'Add' : 'Save')}
        </button>
        {mode === 'edit' && (
          <button type="button" onClick={onCancel} disabled={busy}>Cancel</button>
        )}
      </div>
      {msg && <p className="success">{msg}</p>}
      {err && <p className="error">{err}</p>}
    </form>
  );
}