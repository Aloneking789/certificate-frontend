import { NextResponse } from 'next/server';
import { getTokenFromCookieHeader } from '@/lib/auth';

export async function GET(req: Request) {
  try {
    const cookieHeader = req.headers.get('cookie') || '';
    const token = getTokenFromCookieHeader(cookieHeader);
    if (!token) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });

    const res = await fetch('https://eunous-certificate-backend.vercel.app/api/certificates/dashboard', {
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Error fetching dashboard' }, { status: 500 });
  }
}
