import { NextResponse } from 'next/server';

export async function GET(req: Request, context: any) {
  try {
    const rawParams = context?.params;
    const params = rawParams && typeof rawParams.then === 'function' ? await rawParams : rawParams;
    const certNum = params?.certificateNumber ?? '';
    const res = await fetch(`https://eunous-certificate-backend.vercel.app/api/certificates/number/${encodeURIComponent(certNum)}`);
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Error fetching certificate' }, { status: 500 });
  }
}
