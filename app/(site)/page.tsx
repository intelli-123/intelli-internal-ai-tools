// app/(site)/page.tsx
import AppCard from '../../components/AppCard';
import { listApps } from '../../lib/db';

export default async function Home() {
  const apps = await listApps();

  return (
    <>
      {/* Hero / Intro */}
      <section className="hero">
        <div className="hero__content" style={{ textAlign: 'center' }}> {/* Added text-align: center */}
          <h1 className="hero__title" style={{ color: '#2563EB' }}> {/* Example: Blue color */}
            Intelli-Internal-AI-Tools
          </h1>
          <p className="hero__subtitle" style={{ color: '#6B7280' }}> {/* Example: Gray color */}
            Your internal launchpad for AI utilities, prototypes, and internal docs — organized and accessible.
          </p>
          <div className="hero__cta">
            {/* Call to action elements can go here */}
          </div>
        </div>
        <div className="hero__bg"></div>
      </section>

      {/* Cards Grid (uses the same .card/.thumb styling as Settings) */}
      <section className="section">
        <h2 className="section__title">Available Tools</h2>

        {apps.length === 0 ? (
          <p className="section__muted">
            No apps yet.
          </p>
        ) : (
          <div className="grid cards">
            {apps
              .filter(Boolean)
              .map((app) => (
                <AppCard key={app.id} app={app} />
              ))}
          </div>
        )}
      </section>
    </>
  );
}