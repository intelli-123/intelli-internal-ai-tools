// app/(site)/admin/login/page.tsx
export const dynamic = 'force-dynamic'; // Render at request time; no static prerender

import LoginClient from './LoginClient';

type SearchParams = { [key: string]: string | string[] | undefined };

export default function AdminLoginPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  // Read ?next=… on the server (no client hook needed)
  const nextParam = searchParams?.next;
  const next =
    typeof nextParam === 'string' && nextParam.trim()
      ? nextParam
      : '/internalaitools/settings';

  return (
    <section className="authBox">
      <h2>Admin Login</h2>
      {/* Pass next to the client component */}
      <LoginClient next={next} />
    </section>
  );
}