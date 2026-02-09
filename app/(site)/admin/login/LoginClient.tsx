// app/(site)/admin/login/LoginClient.tsx
'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function LoginClient({ next }: { next: string }) {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [err, setErr] = useState<string>('');
  const [busy, setBusy] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setErr('');
    setBusy(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      if (res.ok) {
        router.push(next);
      } else {
        const data = await res.json().catch(() => ({}));
        setErr(data.error || 'Login failed');
      }
    } catch (e: any) {
      setErr(e.message || 'Something went wrong');
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={handleLogin}>
      <input
        type="password"
        placeholder="Enter admin password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        autoFocus
      />
      <button type="submit" disabled={busy}>
        {busy ? 'Signing in…' : 'Login'}
      </button>
      {err && <p className="error">{err}</p>}
    </form>
  );
}