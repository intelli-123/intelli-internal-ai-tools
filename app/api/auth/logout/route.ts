import { cookies } from 'next/headers';

export async function POST() {
  (await cookies()).delete('admin'); // remove admin session
  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}