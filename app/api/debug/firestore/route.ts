// app/api/debug/firestore/route.ts
import { NextResponse } from 'next/server';
import { listApps } from '../../../../lib/db';
export async function GET() {
  try {
    const apps = await listApps();
    return NextResponse.json({ ok: true, count: apps.length });
  } catch (e: any) {
    return NextResponse.json({ ok: false, code: e.code, message: e.message }, { status: 500 });
  }
}