// app/(site)/admin/login/page.tsx
export const dynamic = 'force-dynamic'; 

import LoginClient from './LoginClient';

type SearchParams = { [key: string]: string | string[] | undefined };

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  
  const resolvedSearchParams = (await searchParams) as SearchParams;

  const nextParam = resolvedSearchParams?.next; 
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