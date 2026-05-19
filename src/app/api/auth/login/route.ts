import { NextResponse } from 'next/server';
import { serializeTokenCookie } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const res = await fetch('https://eunous-certificate-backend.vercel.app/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    const data = await res.json();

    if (res.ok && data?.token) {
      const cookie = serializeTokenCookie(data.token);
      return NextResponse.json({ success: true }, { headers: { 'Set-Cookie': cookie } });
    }

    return NextResponse.json({ success: false, message: data?.message || 'Invalid credentials' }, { status: 401 });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Authentication error' }, { status: 500 });
  }
}
