import React from 'react';
import { cookies, headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { FileText, CheckCircle2, Clock, PlusCircle, ArrowUpRight, Search } from 'lucide-react';
import Link from 'next/link';
import QuickVerify from '@/components/admin/QuickVerify';

export default async function DashboardPage() {
  const token = ((await cookies()) as any).get('certiflow_token')?.value;
  if (!token) redirect('/admin/login');

  const res = await fetch('https://eunous-certificate-backend.vercel.app/api/certificates/dashboard', {
    headers: { Authorization: `Bearer ${token}` },
    cache: 'no-store',
  });

  if (!res.ok) {
    // if unauthorized, redirect to login
    if (res.status === 401) redirect('/admin/login');
    return (
      <AdminLayout>
        <div className="p-4">Unable to load dashboard.</div>
      </AdminLayout>
    );
  }

  const json = await res.json();
  const data = json.data;

  const certificates = data?.recentCertificates || [];

  const stats = [
    { title: 'Total Certificates', value: data?.totalCertificates ?? 0, icon: FileText, color: 'text-primary', bg: 'bg-primary/10' },
    { title: 'Verified Today', value: data?.certificatesToday ?? 0, icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { title: 'New This Week', value: data?.newThisWeek ?? data?.totalCertificates ?? 0, icon: Clock, color: 'text-accent', bg: 'bg-accent/10' },
  ];

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-headline font-bold text-primary">Overview</h1>
            <p className="text-muted-foreground">Monitor and manage internship credentialing activity.</p>
          </div>
          <Link href="/admin/create">
            <Button className="gap-2 h-11 px-6 shadow-lg shadow-primary/20">
              <PlusCircle className="w-5 h-5" />
              Issue New Certificate
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stats.map((stat) => (
            <Card key={stat.title} className="border-none shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-6 flex items-center gap-6">
                <div className={`w-14 h-14 rounded-2xl ${stat.bg} flex items-center justify-center`}>
                  <stat.icon className={`w-8 h-8 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">{stat.title}</p>
                  <p className="text-3xl font-bold text-primary">{stat.value}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <Card className="lg:col-span-2 border-none shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-xl font-bold">Recent Issues</CardTitle>
                <CardDescription>The latest internship certificates generated.</CardDescription>
              </div>
              <Link href="/admin/certificates">
                <Button variant="ghost" className="text-accent gap-1 font-bold">
                  View All
                  <ArrowUpRight className="w-4 h-4" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student</TableHead>
                    <TableHead>Registration No.</TableHead>
                    <TableHead>Domain</TableHead>
                    <TableHead>Issue Date</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {certificates.slice(0, 5).map((cert: any) => (
                    <TableRow key={cert.id} className="group">
                      <TableCell className="font-semibold text-primary">{cert.fullName || cert.studentName}</TableCell>
                      <TableCell className="font-code text-xs text-muted-foreground">{cert.certificateNumber || cert.registrationNumber}</TableCell>
                      <TableCell>{cert.internshipDomain}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{new Date(cert.createdAt || cert.certificateIssueDate || cert.issueDate).toLocaleDateString()}</TableCell>
                      <TableCell className="text-right">
                        <a href={`https://certificate-frontend-navy.vercel.app/certificate/${cert.certificateNumber || cert.registrationNumber}`} target="_blank" rel="noopener noreferrer">
                          <Button variant="ghost" size="icon" className="group-hover:text-accent">
                            <Search className="w-4 h-4" />
                          </Button>
                        </a>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm flex flex-col">
            <CardHeader>
              <CardTitle className="text-xl font-bold">Quick Verification</CardTitle>
              <CardDescription>Search records instantly.</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col justify-between">
              <QuickVerify />

              <div className="mt-8 p-6 bg-primary rounded-2xl text-white relative overflow-hidden group">
                <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-white/10 rounded-full group-hover:scale-150 transition-transform duration-500" />
                <h3 className="font-headline font-bold text-lg mb-2 relative z-10">System Status</h3>
                <div className="flex items-center gap-2 mb-4 relative z-10">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                  <span className="text-sm font-medium opacity-90">All Systems Operational</span>
                </div>
                <p className="text-xs opacity-70 relative z-10">Credential verification server is synced and running efficiently.</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}
