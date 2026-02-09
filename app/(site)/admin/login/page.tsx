// app/(site)/admin/login/page.tsx

export const dynamic = 'force-dynamic'

'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function AdminLogin() {
  const [password, setPassword] = useState('');
  const [err, setErr] = useState<string>('');
  const [busy, setBusy] = useState(false);

  const router = useRouter();
  const sp = useSearchParams();
  const next = sp.get('next') || '/internalaitools/settings';

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
    <section className="authBox">
      <h2>Admin Login</h2>
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
    </section>
  );
}