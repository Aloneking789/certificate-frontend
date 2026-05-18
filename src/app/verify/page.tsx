"use client"
import { useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Search, ShieldCheck, AlertCircle, CheckCircle2, QrCode, Printer, ExternalLink } from 'lucide-react';
import { getCertificateByReg, Certificate } from '@/app/lib/mock-data';
import Link from 'next/link';

export default function VerifyPage() {
  const [regNumber, setRegNumber] = useState('');
  const [result, setResult] = useState<Certificate | null>(null);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleVerify = () => {
    setLoading(true);
    setError(false);
    setResult(null);
    
    // Simulate API delay
    setTimeout(() => {
      const cert = getCertificateByReg(regNumber);
      if (cert) {
        setResult(cert);
      } else {
        setError(true);
      }
      setLoading(false);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 py-16 max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-headline font-bold text-primary mb-4 tracking-tight">Verify Credential</h1>
          <p className="text-muted-foreground text-lg">Enter the unique registration number provided on the certificate to authenticate.</p>
        </div>

        <Card className="shadow-xl border-none mb-12 overflow-hidden">
          <div className="bg-primary p-1" />
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
                <Input 
                  placeholder="e.g., EUNOUS-REG-2026-0001" 
                  className="h-14 pl-12 text-lg font-code"
                  value={regNumber}
                  onChange={(e) => setRegNumber(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleVerify()}
                />
              </div>
              <Button 
                onClick={handleVerify} 
                className="h-14 px-8 text-lg font-bold gap-2"
                disabled={loading || !regNumber}
              >
                {loading ? 'Verifying...' : 'Verify Now'}
              </Button>
            </div>
          </CardContent>
        </Card>

        {error && (
          <Card className="border-destructive/20 bg-destructive/5 animate-in fade-in slide-in-from-top-4 duration-500">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="w-8 h-8 text-destructive" />
              </div>
              <h3 className="text-2xl font-bold text-destructive mb-2">Certificate Not Found</h3>
              <p className="text-muted-foreground">The registration number entered does not match our records. Please check and try again.</p>
            </CardContent>
          </Card>
        )}

        {result && (
          <Card className="animate-in fade-in slide-in-from-top-4 duration-500 overflow-hidden shadow-2xl border-none">
            <div className="bg-emerald-500 p-1 flex justify-center text-white text-xs font-bold gap-2 py-2">
              <CheckCircle2 className="w-4 h-4" />
              AUTHENTICATED CREDENTIAL
            </div>
            <CardHeader className="bg-white border-b flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-2xl font-bold text-primary">{result.studentName}</CardTitle>
                <CardDescription className="text-base">{result.internshipDomain} Intern</CardDescription>
              </div>
              <Badge variant="default" className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 h-8 px-4 text-sm font-bold uppercase tracking-wider">
                VALID
              </Badge>
            </CardHeader>
            <CardContent className="p-8 bg-white">
              <div className="grid md:grid-cols-2 gap-8 mb-8">
                <div className="space-y-4">
                  <div>
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1">Registration Number</p>
                    <p className="text-lg font-code font-bold text-primary">{result.registrationNumber}</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1">Course & College</p>
                    <p className="text-lg font-semibold text-primary">{result.courseName} - {result.collegeName}</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1">Duration</p>
                    <p className="text-lg font-semibold text-primary">{result.startDate} to {result.endDate}</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1">Total Hours Completed</p>
                    <p className="text-lg font-semibold text-primary">{result.totalHours} Hours</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1">Performance Grade</p>
                    <p className="text-lg font-semibold text-primary">{result.performance}</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1">Issue Date</p>
                    <p className="text-lg font-semibold text-primary">{result.issueDate}</p>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 mt-8 pt-8 border-t">
                <Link href={`/certificate/${result.registrationNumber}`} className="flex-1">
                  <Button className="w-full gap-2 h-12">
                    <ExternalLink className="w-4 h-4" />
                    View Original Certificate
                  </Button>
                </Link>
                <Button variant="outline" className="flex-1 gap-2 h-12" onClick={() => window.print()}>
                  <Printer className="w-4 h-4" />
                  Print Summary
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}
