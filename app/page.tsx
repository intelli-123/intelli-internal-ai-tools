// intelli-internal-ai-tools/app/page.tsx

import AppCard from '../components/AppCard';
import { listApps } from '../lib/db';

// Force dynamic rendering → ensures we always fetch fresh Firestore data
export const dynamic = 'force-dynamic';
// Alternative: export const revalidate = 0;

export default async function Home() {
  const apps = await listApps();
  const hasApps = Array.isArray(apps) && apps.length > 0;

  return (
    <div style={{ backgroundColor: '#111111', minHeight: '100vh' }}>
      {/* Hero */}
      <section className="hero">
        <div className="hero__content" style={{ textAlign: 'center' }}>
          <h1 className="hero__title" style={{ color: '#f5f7f9' }}>
            Intelli-Internal-AI-Tools
          </h1>

          <p className="hero__subtitle" style={{ color: '#6c605c' }}>
            Your internal launchpad for AI utilities, prototypes, and internal docs — organized and accessible.
          </p>

          <div className="hero__cta" />
        </div>

        <div className="hero__bg"></div>
      </section>

      {/* Cards */}
      <section className="section">
        <h2 className="section__title" style={{ color: '#dfe0e3' }}>
          Available Tools
        </h2>

        {/* TEMP DEBUG: shows what server sees */}
        <p className="text-xs" style={{ color: '#6c605c' }}>
          Count: {Array.isArray(apps) ? apps.length : '—'}
        </p>

        {hasApps ? (
          <div className="grid cards">
            {apps.filter(Boolean).map((app) => (
              <AppCard key={app.id} app={app} />
            ))}
          </div>
        ) : (
          <p className="section__muted" style={{ color: '#6c605c' }}>
            No apps yet.
          </p>
        )}
      </section>
    </div>
  );
}