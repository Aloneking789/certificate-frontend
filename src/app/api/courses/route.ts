import { NextResponse } from 'next/server';
import { getTokenFromCookieHeader } from '@/lib/auth';

export async function GET(req: Request) {
  try {
    const headers: Record<string, string> = {};
    const authHeader = req.headers.get('authorization');
    const cookie = req.headers.get('cookie') || '';
    // prefer explicit Authorization header, otherwise derive from cookie
    if (authHeader) {
      headers['Authorization'] = authHeader;
    } else {
      const token = getTokenFromCookieHeader(cookie);
      if (token) headers['Authorization'] = `Bearer ${token}`;
      if (cookie) headers['cookie'] = cookie;
    }

    const res = await fetch('https://eunous-certificate-backend.vercel.app/api/courses', { headers });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Error fetching courses' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    const authHeader = req.headers.get('authorization');
    const cookie = req.headers.get('cookie') || '';
    if (authHeader) {
      headers['Authorization'] = authHeader;
    } else {
      const token = getTokenFromCookieHeader(cookie);
      if (token) headers['Authorization'] = `Bearer ${token}`;
      if (cookie) headers['cookie'] = cookie;
    }

    const res = await fetch('https://eunous-certificate-backend.vercel.app/api/courses', {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
    });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Error creating course' }, { status: 500 });
  }
}
