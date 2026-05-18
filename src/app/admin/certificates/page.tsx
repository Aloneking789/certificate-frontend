"use client"
import { useState } from 'react';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Search, Filter, Eye, Edit, Trash2, Download, Printer } from 'lucide-react';
import { getAllCertificates } from '@/app/lib/mock-data';
import Link from 'next/link';

export default function ManageCertificatesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const certificates = getAllCertificates();

  const filteredCertificates = certificates.filter(cert => 
    cert.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cert.registrationNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
                {filteredCertificates.length > 0 ? (
                  filteredCertificates.map((cert) => (
                    <TableRow key={cert.id} className="hover:bg-secondary/10 transition-colors">
                      <TableCell className="font-semibold text-primary pl-6">{cert.studentName}</TableCell>
                      <TableCell className="font-code text-xs text-muted-foreground">{cert.registrationNumber}</TableCell>
                      <TableCell>{cert.internshipDomain}</TableCell>
                      <TableCell>{cert.totalHours} hrs</TableCell>
                      <TableCell className="text-sm">{cert.issueDate}</TableCell>
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
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive">
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
                        <p className="text-lg font-medium">No certificates found</p>
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
