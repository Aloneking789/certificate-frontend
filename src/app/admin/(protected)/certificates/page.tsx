"use client"
import React, { useEffect, useRef, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Search, Filter, Eye, Edit, Trash2, Download } from 'lucide-react';
import Link from 'next/link';

export default function ManageCertificatesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [certificates, setCertificates] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const debounceRef = useRef<number | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchCerts('', 1);
  }, []);

  useEffect(() => {
    if (debounceRef.current) window.clearTimeout(debounceRef.current);
    debounceRef.current = window.setTimeout(() => {
      fetchCerts(searchTerm, 1);
    }, 300);
    return () => { if (debounceRef.current) window.clearTimeout(debounceRef.current); };
  }, [searchTerm]);

  async function fetchCerts(search = '', pageNo = 1) {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.set('search', search);
      params.set('page', String(pageNo));

      const res = await fetch(`/api/certificates?${params.toString()}`, { cache: 'no-store' });
      if (!res.ok) {
        setCertificates([]);
        return;
      }
      const json = await res.json();
      const data = json.data;
      setCertificates(data?.items || []);
      setPage(data?.page || 1);
      setTotalPages(data?.totalPages || 1);
    } catch (err) {
      setCertificates([]);
    } finally {
      setLoading(false);
    }
  }

  const handleEdit = async (cert: any) => {
    const newHoursStr = window.prompt('Enter new total hours', String(cert.totalHours || ''));
    if (newHoursStr === null) return;
    const newHours = Number(newHoursStr);
    if (Number.isNaN(newHours)) {
      toast({ variant: 'destructive', title: 'Invalid input', description: 'Total hours must be a number' });
      return;
    }

    const newPerf = window.prompt('Enter new performance', cert.performance || 'Very Good');
    if (newPerf === null) return;

    setLoading(true);
    try {
      const res = await fetch(`/api/certificates/${cert.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ totalHours: newHours, performance: newPerf }),
      });
      const data = await res.json();
      if (res.ok && data?.success) {
        toast({ title: 'Updated', description: 'Certificate updated successfully.' });
        fetchCerts(searchTerm, page);
      } else {
        toast({ variant: 'destructive', title: 'Update failed', description: data?.message || 'Unable to update certificate' });
      }
    } catch (err) {
      toast({ variant: 'destructive', title: 'Network error', description: 'Could not contact server.' });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (cert: any) => {
    if (!confirm(`Delete certificate ${cert.registrationNumber || cert.fullName}? This cannot be undone.`)) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/certificates/${cert.id}`, { method: 'DELETE' });
      const data = await res.json();
      if (res.ok && data?.success) {
        toast({ title: 'Deleted', description: 'Certificate deleted.' });
        fetchCerts(searchTerm, page);
      } else {
        toast({ variant: 'destructive', title: 'Delete failed', description: data?.message || 'Unable to delete' });
      }
    } catch (err) {
      toast({ variant: 'destructive', title: 'Network error', description: 'Could not contact server.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-headline font-bold text-primary">Certificate Registry</h1>
            <p className="text-muted-foreground">Manage and track all issued credentials.</p>
          </div>
        </div>

        <Card className="border-none shadow-sm">
          <CardHeader className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input 
                  placeholder="Search by student name or registration number..." 
                  className="pl-10 h-11"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Button variant="outline" className="h-11 gap-2">
                <Filter className="w-4 h-4" />
                Filters
              </Button>
              <Button variant="outline" className="h-11 gap-2">
                <Download className="w-4 h-4" />
                Export CSV
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader className="bg-secondary/30">
                <TableRow>
                  <TableHead className="w-[250px] pl-6">Student Name</TableHead>
                  <TableHead>Reg. Number</TableHead>
                  <TableHead>Domain</TableHead>
                  <TableHead>Total Hours</TableHead>
                  <TableHead>Issue Date</TableHead>
                  <TableHead className="text-right pr-6">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {certificates.length > 0 ? (
                  certificates.map((cert) => (
                    <TableRow key={cert.id} className="hover:bg-secondary/10 transition-colors">
                      <TableCell className="font-semibold text-primary pl-6">{cert.fullName || cert.studentName}</TableCell>
                      <TableCell className="font-code text-xs text-muted-foreground">{cert.registrationNumber}</TableCell>
                      <TableCell>{cert.internshipDomain}</TableCell>
                      <TableCell>{cert.totalHours} hrs</TableCell>
                      <TableCell className="text-sm">{new Date(cert.certificateIssueDate || cert.createdAt || cert.issueDate).toLocaleDateString()}</TableCell>
                      <TableCell className="text-right pr-6">
                        <div className="flex justify-end gap-2">
                          <Link href={`/certificate/${cert.registrationNumber}`}>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary">
                              <Eye className="w-4 h-4" />
                            </Button>
                          </Link>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-accent">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-accent" onClick={() => handleEdit(cert)}>
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive" onClick={() => handleDelete(cert)}>
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="h-64 text-center">
                      <div className="flex flex-col items-center justify-center text-muted-foreground">
                        <Search className="w-12 h-12 mb-4 opacity-20" />
                        <p className="text-lg font-medium">{loading ? 'Loading...' : 'No certificates found'}</p>
                        <p className="text-sm">Try adjusting your search criteria.</p>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
