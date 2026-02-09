// app/(settings)/internalaitools/settings/page.tsx
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { listApps } from '../../../../lib/db';
import { AppForm } from '../../../../components/AppForm';
import AppTable from '../../../../components/AppTable';
import LogoutButton from './LogoutButton';

export default async function SettingsPage() {
  const isAdmin = (await cookies()).get('admin')?.value === '1';
  if (!isAdmin) {
    redirect(`/admin/login?next=${encodeURIComponent('/internalaitools/settings')}`);
  }

  const apps = await listApps();

  return (
    <section>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>Settings · Intellli-Internal-AI- Tools</h1>
        <LogoutButton />
      </div>

      <p>Add or manage tools. Newly added items appear on the Home page.</p>

      <AppForm mode="create" />
      <hr />
      <h2>Existing Apps</h2>
      <AppTable apps={apps} />
    </section>
  );
}