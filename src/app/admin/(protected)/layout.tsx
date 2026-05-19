import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import React from 'react';

export default async function ProtectedAdminLayout({ children }: { children: React.ReactNode }) {
  const token = ((await cookies()) as any).get('certiflow_token')?.value;
  if (!token) {
    redirect('/admin/login');
  }

  return <>{children}</>;
}
