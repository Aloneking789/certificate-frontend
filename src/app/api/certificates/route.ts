import { NextResponse } from 'next/server';
import { getTokenFromCookieHeader } from '@/lib/auth';

export async function GET(req: Request) {
  try {
    const cookieHeader = req.headers.get('cookie') || '';
    const token = getTokenFromCookieHeader(cookieHeader);
    if (!token) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });

    const url = new URL(req.url);
    const search = url.search; // includes ?search=...
    const backendUrl = `https://eunous-certificate-backend.vercel.app/api/certificates${search}`;

    const res = await fetch(backendUrl, { headers: { Authorization: `Bearer ${token}` } });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Error fetching certificates' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const cookieHeader = req.headers.get('cookie') || '';
    const token = getTokenFromCookieHeader(cookieHeader);
    if (!token) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });

    const body = await req.json();
    const res = await fetch('https://eunous-certificate-backend.vercel.app/api/certificates', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Error creating certificate' }, { status: 500 });
  }
}
