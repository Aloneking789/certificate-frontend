import { NextResponse } from 'next/server';
import { serializeTokenCookieClear } from '@/lib/auth';

export async function POST() {
  const cookie = serializeTokenCookieClear();
  return NextResponse.json({ success: true }, { headers: { 'Set-Cookie': cookie } });
}
