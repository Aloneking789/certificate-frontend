"use client"
import React, { useEffect, useRef, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Search, Filter, Eye, Edit, Trash2, Download } from 'lucide-react';
import Link from 'next/link';

export default function ManageCertificatesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [certificates, setCertificates] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState<any | null>(null);
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
      // sort items newest-first by common date fields
      const items = (data?.items || []).slice();
      items.sort((a: any, b: any) => {
        const getTime = (c: any) => {
          const candidates = [c?.certificateIssueDate, c?.issueDate, c?.createdAt, c?.created_at, c?.updatedAt, c?.updated_at];
          for (const d of candidates) {
            if (d) {
              const t = Date.parse(d);
              if (!Number.isNaN(t)) return t;
            }
          }
          return 0;
        };
        return getTime(b) - getTime(a);
      });
      setCertificates(items || []);
      setPage(data?.page || 1);
      setTotalPages(data?.totalPages || 1);
    } catch (err) {
      setCertificates([]);
    } finally {
      setLoading(false);
    }
  }

  const handleEdit = (cert: any) => {
    const toInputDate = (d: any) => {
      if (!d) return '';
      try {
        const dt = new Date(d);
        if (Number.isNaN(dt.getTime())) return '';
        return dt.toISOString().slice(0, 10);
      } catch (e) {
        return '';
      }
    };

    const pick = (obj: any, ...keys: string[]) => {
      for (const k of keys) {
        if (obj?.[k]) return obj[k];
      }
      return '';
    };

    setEditing({
      id: cert.id,
      fullName: cert.fullName || cert.studentName || '',
      fatherName: cert.fatherName || '',
      startDate: toInputDate(pick(cert, 'startDate', 'start_date', 'start')),
      endDate: toInputDate(pick(cert, 'endDate', 'end_date', 'end')),
      totalHours: cert.totalHours || 0,
      performance: cert.performance || 'Very Good',
      issueDate: toInputDate(pick(cert, 'issueDate', 'certificateIssueDate', 'certificate_issue_date')),
    });
  };

  const submitEdit = async (payload: any) => {
    setLoading(true);
    try {
      // Build a minimal body: only include fields that were changed (non-empty and different)
      const fields = ['fullName', 'fatherName', 'startDate', 'endDate', 'totalHours', 'performance', 'issueDate'];
      const body: any = {};
      for (const f of fields) {
        const newVal = payload[f as keyof typeof payload];
        const oldVal = (editing as any)?.[f];
        if (f === 'totalHours') {
          const newNum = Number(newVal || 0);
          const oldNum = Number(oldVal || 0);
          if (!Number.isNaN(newNum) && newNum !== oldNum) body[f] = newNum;
        } else {
          // include if non-empty and different from old value
          if (typeof newVal === 'string') {
            if (newVal.trim() !== '' && String(newVal) !== String(oldVal)) body[f] = newVal;
          } else if (newVal != null && String(newVal) !== String(oldVal)) {
            body[f] = newVal;
          }
        }
      }

      if (Object.keys(body).length === 0) {
        toast({ title: 'No changes', description: 'No fields were changed.' });
        setEditing(null);
        setLoading(false);
        return;
      }

      const res = await fetch(`/api/certificates/${payload.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (res.ok && data?.success) {
        toast({ title: 'Updated', description: 'Certificate updated successfully.' });
        fetchCerts(searchTerm, page);
        setEditing(null);
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
        {/* Edit modal */}
        <Dialog open={Boolean(editing)} onOpenChange={(open) => { if (!open) setEditing(null); }}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Certificate</DialogTitle>
            </DialogHeader>

            {editing && (
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  const form = e.target as HTMLFormElement;
                  const formData = new FormData(form);
                  const payload = {
                    id: editing.id,
                    fullName: String(formData.get('fullName') || ''),
                    fatherName: String(formData.get('fatherName') || ''),
                    startDate: String(formData.get('startDate') || ''),
                    endDate: String(formData.get('endDate') || ''),
                    totalHours: Number(formData.get('totalHours') || 0),
                    performance: String(formData.get('performance') || ''),
                    issueDate: String(formData.get('issueDate') || ''),
                  };
                  await submitEdit(payload);
                }}
              >
                <div className="grid gap-2">
                  <div>
                    <Label>Full Name</Label>
                    <Input name="fullName" defaultValue={editing.fullName} />
                  </div>
                  <div>
                    <Label>Father's Name</Label>
                    <Input name="fatherName" defaultValue={editing.fatherName} />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label>Start Date</Label>
                      <Input name="startDate" type="date" defaultValue={editing.startDate} />
                    </div>
                    <div>
                      <Label>End Date</Label>
                      <Input name="endDate" type="date" defaultValue={editing.endDate} />
                    </div>
                  </div>

                  <div>
                    <Label>Total Hours</Label>
                    <Input name="totalHours" type="number" defaultValue={String(editing.totalHours || 0)} />
                  </div>

                  <div>
                    <Label>Performance</Label>
                    <Input name="performance" defaultValue={editing.performance} />
                  </div>

                  <div>
                    <Label>Issue Date</Label>
                    <Input name="issueDate" type="date" defaultValue={editing.issueDate} />
                  </div>

                  <DialogFooter className="pt-4">
                    <div className="flex gap-2 justify-end">
                      <Button type="button" variant="outline" onClick={() => setEditing(null)} disabled={loading}>Cancel</Button>
                      <Button type="submit" disabled={loading}>{loading ? 'Saving...' : 'Save'}</Button>
                    </div>
                  </DialogFooter>
                </div>
              </form>
            )}
          </DialogContent>
        </Dialog>
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
                      <TableCell className="font-code text-xs text-muted-foreground">{cert.certificateNumber || cert.registrationNumber}</TableCell>
                      <TableCell>{cert.internshipDomain}</TableCell>
                      <TableCell>{cert.totalHours} hrs</TableCell>
                      <TableCell className="text-sm">{new Date(cert.certificateIssueDate || cert.createdAt || cert.issueDate).toLocaleDateString()}</TableCell>
                      <TableCell className="text-right pr-6">
                        <div className="flex justify-end gap-2">
                          <a href={`${process.env.NEXT_PUBLIC_CERT_BASE || 'https://certificate.euonusit.com'}/certificate/${cert.certificateNumber || cert.registrationNumber}`} target="_blank" rel="noopener noreferrer">
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary">
                              <Eye className="w-4 h-4" />
                            </Button>
                          </a>
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
          {/* Pagination controls */}
          <div className="flex items-center justify-between px-6 py-4 border-t">
            <div className="text-sm text-muted-foreground">Page {page} of {totalPages}</div>
            <div className="flex items-center gap-2">
              <Button size="sm" variant="ghost" disabled={page <= 1} onClick={() => fetchCerts(searchTerm, page - 1)}>Prev</Button>

              {/* page numbers window */}
              {(() => {
                const pages = [] as number[];
                const maxButtons = 7;
                let start = Math.max(1, page - Math.floor(maxButtons / 2));
                let end = start + maxButtons - 1;
                if (end > totalPages) { end = totalPages; start = Math.max(1, end - maxButtons + 1); }
                for (let p = start; p <= end; p++) pages.push(p);
                return (
                  <div className="inline-flex items-center gap-1">
                    {start > 1 && (
                      <Button size="sm" variant="ghost" onClick={() => fetchCerts(searchTerm, 1)}>1</Button>
                    )}
                    {start > 2 && <div className="px-2">…</div>}
                    {pages.map(p => (
                      <Button key={p} size="sm" variant={p === page ? 'default' : 'ghost'} onClick={() => fetchCerts(searchTerm, p)}>{p}</Button>
                    ))}
                    {end < totalPages - 1 && <div className="px-2">…</div>}
                    {end < totalPages && (
                      <Button size="sm" variant="ghost" onClick={() => fetchCerts(searchTerm, totalPages)}>{totalPages}</Button>
                    )}
                  </div>
                );
              })()}

              <Button size="sm" variant="ghost" disabled={page >= totalPages} onClick={() => fetchCerts(searchTerm, page + 1)}>Next</Button>
            </div>
          </div>
        </Card>
      </div>
    </AdminLayout>
  );
}
