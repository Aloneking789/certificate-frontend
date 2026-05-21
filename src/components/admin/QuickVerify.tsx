"use client"
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Search, CheckCircle2, AlertCircle, ExternalLink, Printer } from 'lucide-react';

type VerifyResult = {
  registrationNumber: string;
  studentName: string;
  internshipDomain?: string;
  courseName?: string;
  collegeName?: string;
  startDate?: string;
  endDate?: string;
  totalHours?: number;
  performance?: string;
  issueDate?: string;
  isVerified?: boolean;
};

export default function QuickVerify() {
  const [reg, setReg] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<VerifyResult | null>(null);
  const [error, setError] = useState('');

  const handleSearch = async () => {
    if (!reg) return setError('Enter certificate number');
    setLoading(true);
    setError('');
    setResult(null);
    try {
      const res = await fetch(`/api/certificates/number/${encodeURIComponent(reg)}`);
      const data = await res.json();
      if (res.ok && data?.data) {
        const c = data.data;
        const mapped: VerifyResult = {
          registrationNumber: c.registrationNumber,
          studentName: c.fullName,
          internshipDomain: c.internshipDomain || '',
          courseName: c.courseName || '',
          collegeName: c.collegeName || '',
          startDate: c.startDate ? new Date(c.startDate).toLocaleDateString() : '',
          endDate: c.endDate ? new Date(c.endDate).toLocaleDateString() : '',
          totalHours: c.totalHours ?? 0,
          performance: c.performance || 'Very Good',
          issueDate: c.certificateIssueDate ? new Date(c.certificateIssueDate).toLocaleDateString() : (c.issueDate ? new Date(c.issueDate).toLocaleDateString() : (c.createdAt ? new Date(c.createdAt).toLocaleDateString() : '')),
          isVerified: c.isVerified
        };
        setResult(mapped);
      } else {
        setError('Certificate not found');
      }
    } catch (err) {
      setError('Unable to verify at this time');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Enter Certificate No."
            value={reg}
            onChange={(e: any) => setReg(e.target.value)}
            onKeyPress={(e: any) => e.key === 'Enter' && handleSearch()}
            className="h-11 pl-10"
          />
        </div>
        <Button onClick={handleSearch} className="w-full h-11 bg-accent hover:bg-accent/90 mt-3" disabled={!reg || loading}>
          {loading ? 'Searching...' : 'Search Record'}
        </Button>
      </div>

      {error && (
        <div className="text-sm text-destructive">{error}</div>
      )}

      {result && (
        <Card className="animate-in fade-in slide-in-from-top-4 duration-300 overflow-hidden shadow-sm border-none">
          <div className="bg-emerald-500 p-1 flex justify-center text-white text-xs font-bold gap-2 py-2">
            <CheckCircle2 className="w-4 h-4" />
            AUTHENTICATED CREDENTIAL
          </div>
          <CardContent className="p-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest mb-1">Student</p>
                <p className="text-lg font-semibold text-primary">{result.studentName}</p>
                <p className="text-xs font-code text-muted-foreground mt-1">{result.registrationNumber}</p>
              </div>
              <div className="text-right space-y-2">
                <Badge variant="default" className={result.isVerified ? 'bg-emerald-100 text-emerald-700 h-8 px-3' : 'bg-destructive/10 text-destructive h-8 px-3'}>
                  {result.isVerified ? 'VALID' : 'INVALID'}
                </Badge>
                <a href={`http://localhost:9002/certificate/${result.registrationNumber}`} target="_blank" rel="noopener noreferrer">
                  <Button variant="ghost" className="mt-2">View</Button>
                </a>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
