//intelli-internal-ai-tools\app\page.tsx

import AppCard from '../components/AppCard';
import { listApps } from '../lib/db';

export default async function Home() {
  const apps = await listApps();

  return (
    // Wrap the entire page content in a div and apply the background color to simulate body background
    <div style={{ backgroundColor: '#111111', minHeight: '100vh' }}> {/* Added background color for the overall page content and minHeight */}
      {/* Hero / Intro */}
      <section className="hero"> {/* Retaining the hero's specific background color from previous step */}
        <div className="hero__content" style={{ textAlign: 'center' }}>
          <h1 className="hero__title" style={{ color: '#f5f7f9' }}>
            Intelli-Internal-AI-Tools
          </h1>
          <p className="hero__subtitle" style={{ color: '#6c605c' }}>
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
        <h2 className="section__title" style={{ color: '#dfe0e3' }}>Available Tools</h2>

        {apps.length === 0 ? (
          <p className="section__muted" style={{ color: '#6c605c' }}>
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
    </div>
  );
}