import { NextResponse } from 'next/server';
import { getTokenFromCookieHeader } from '@/lib/auth';

export async function GET(req: Request) {
  const token = getTokenFromCookieHeader(req.headers.get('cookie') || '');
  if (!token) return NextResponse.json({ authenticated: false }, { status: 401 });
  return NextResponse.json({ authenticated: true });
}
