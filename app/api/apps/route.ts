// app/api/apps/route.ts
import { NextResponse } from 'next/server';
import { addApp, listApps } from '../../../lib/db';

function isAdminCookieOk(req: Request) {
  // Read cookies from the request headers (server)
  const cookie = req.headers.get('cookie') || '';
  return /(?:^|;\s*)admin=1(?:;|$)/.test(cookie);
}

// GET: list apps
export async function GET() {
  const apps = await listApps();
  return NextResponse.json({ apps });
}

// POST: add app (admin only)
export async function POST(req: Request) {
  if (!isAdminCookieOk(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const body = await req.json();
  const { name, imageUrl, readmeUrl, appUrl } = body ?? {};
  if (!name || !imageUrl || !readmeUrl || !appUrl) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
  }
  const created = await addApp({ name, imageUrl, readmeUrl, appUrl });
  return NextResponse.json(created, { status: 201 });
}