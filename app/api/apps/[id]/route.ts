// app/api/apps/[id]/route.ts
import { NextResponse, type NextRequest } from 'next/server';
import { deleteApp, updateApp } from '../../../../lib/db';

function isAdmin(req: NextRequest) {
  return req.cookies.get('admin')?.value === '1';
}

// DELETE /api/apps/:id
export async function DELETE(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  if (!isAdmin(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await ctx.params;

  if (!id) {
    return NextResponse.json({ error: 'Missing id' }, { status: 400 });
  }

  await deleteApp(id);
  return NextResponse.json({ ok: true });
}

// PUT /api/apps/:id
export async function PUT(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  if (!isAdmin(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await ctx.params;

  const body = await req.json();
  const { name, imageUrl, readmeUrl, appUrl } = body ?? {};

  const updated = await updateApp(id, { name, imageUrl, readmeUrl, appUrl });
  if (!updated) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }
  return NextResponse.json(updated);
}