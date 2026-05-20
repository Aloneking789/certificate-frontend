import { NextResponse } from 'next/server';
import { getTokenFromCookieHeader } from '@/lib/auth';

export async function PUT(req: Request, context: any) {
  try {
    const cookieHeader = req.headers.get('cookie') || '';
    const token = getTokenFromCookieHeader(cookieHeader);
    if (!token) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });

    // params may be provided as a Promise in some Next.js type signatures — handle both
    const rawParams = context?.params;
    const params = rawParams && typeof rawParams.then === 'function' ? await rawParams : rawParams;

    const body = await req.json();
    const res = await fetch(`https://eunous-certificate-backend.vercel.app/api/certificates/${encodeURIComponent(params?.id ?? '')}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Error updating certificate' }, { status: 500 });
  }
}

export async function DELETE(req: Request, context: any) {
  try {
    const cookieHeader = req.headers.get('cookie') || '';
    const token = getTokenFromCookieHeader(cookieHeader);
    if (!token) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });

    const rawParams = context?.params;
    const params = rawParams && typeof rawParams.then === 'function' ? await rawParams : rawParams;

    const res = await fetch(`https://eunous-certificate-backend.vercel.app/api/certificates/${encodeURIComponent(params?.id ?? '')}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Error deleting certificate' }, { status: 500 });
  }
}
