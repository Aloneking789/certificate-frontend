"use client"
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { ShieldCheck, Sparkles, User, BookOpen, Clock, Building, Save, RotateCcw, AlertTriangle } from 'lucide-react';
import { flagInconsistentCertificateData } from '@/ai/flows/flag-inconsistent-certificate-data';

export default function CreateCertificatePage() {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [auditing, setAuditing] = useState(false);
  const [auditResult, setAuditResult] = useState<{ isInconsistent: boolean; reason?: string } | null>(null);

  const [form, setForm] = useState({
    studentName: '',
    fatherName: '',
    courseName: 'B.Tech',
    collegeName: '',
    branch: '',
    semester: '1st',
    internshipDomain: 'Software Development',
    startDate: '',
    endDate: '',
    totalHours: '',
    performance: 'Excellent' as const,
    authorizedSignatory: 'Director, Eunous IT',
    gender: 'Male',
    studentRoll: '',
    issueDate: new Date().toISOString().split('T')[0],
  });

  const handleAudit = async () => {
    if (!form.startDate || !form.endDate || !form.totalHours || !form.internshipDomain) {
      toast({ title: "Audit Error", description: "Please fill dates, hours, and domain first.", variant: "destructive" });
      return;
    }

    setAuditing(true);
    setAuditResult(null);
    try {
      const result = await flagInconsistentCertificateData({
        internshipDomain: form.internshipDomain,
        totalHours: parseInt(form.totalHours),
        startDate: form.startDate,
        endDate: form.endDate,
      });
      setAuditResult(result);
      if (result.isInconsistent) {
        toast({
          title: "AI Audit Alert",
          description: "Potential inconsistency detected in reported hours.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Audit Passed",
          description: "Internship data seems consistent with domain standards.",
        });
      }
    } catch (err) {
      toast({ title: "Audit Failed", description: "Could not perform AI audit.", variant: "destructive" });
    } finally {
      setAuditing(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        fullName: form.studentName,
        fatherName: form.fatherName,
        gender: form.gender,
        studentRoll: form.studentRoll,
        courseName: form.courseName,
        collegeName: form.collegeName,
        branch: form.branch,
        semester: form.semester,
        internshipDomain: form.internshipDomain,
        startDate: form.startDate,
        endDate: form.endDate,
        totalHours: parseInt(form.totalHours || '0'),
        performance: form.performance,
        authorizedSignatory: form.authorizedSignatory,
        issueDate: form.issueDate,
        companyName: 'Eunous IT',
      };

      const res = await fetch('/api/certificates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.status === 401) {
        toast({ title: 'Unauthorized', description: 'Please sign in again.', variant: 'destructive' });
        router.push('/admin/login');
        return;
      }

      if (res.ok && data?.success) {
        const reg = data?.certificate?.registrationNumber || data?.data?.registrationNumber || data?.registrationNumber || data?.data?.certificate?.registrationNumber;
        const regNum = reg || `EUNOUS-REG-2026-${Math.floor(1000 + Math.random() * 9000)}`;

        toast({ title: "Certificate Generated", description: `Successfully issued ${regNum} to ${form.studentName}` });
        router.push(`/certificate/${regNum}`);
      } else {
        toast({ title: 'Creation Failed', description: data?.message || 'Unable to create certificate', variant: 'destructive' });
      }
    } catch (err) {
      toast({ title: 'Network Error', description: 'Could not contact the certificate server.', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-headline font-bold text-primary">Issue New Credential</h1>
          <p className="text-muted-foreground">Fill in the student and internship details to generate a high-fidelity certificate.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Student Details Section */}
            <Card className="border-none shadow-sm">
              <CardHeader className="bg-primary/5 border-b border-primary/10">
                <div className="flex items-center gap-2">
                  <User className="w-5 h-5 text-primary" />
                  <CardTitle className="text-lg">Student Information</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2 col-span-2">
                    <Label>Full Name</Label>
                    <Input 
                      placeholder="e.g. John Doe" 
                      required 
                      value={form.studentName}
                      onChange={e => setForm({...form, studentName: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2 col-span-2">
                    <Label>Father's Name</Label>
                    <Input 
                      placeholder="e.g. Richard Doe" 
                      required 
                      value={form.fatherName}
                      onChange={e => setForm({...form, fatherName: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Gender</Label>
                    <Select value={form.gender} onValueChange={v => setForm({...form, gender: v})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Male">Male</SelectItem>
                        <SelectItem value="Female">Female</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Student Roll Number</Label>
                    <Input
                      placeholder="e.g. CS2026-001"
                      value={form.studentRoll}
                      onChange={e => setForm({...form, studentRoll: e.target.value})}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Course Name</Label>
                    <Select value={form.courseName} onValueChange={v => setForm({...form, courseName: v})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="B.Tech">B.Tech</SelectItem>
                        <SelectItem value="M.Tech">M.Tech</SelectItem>
                        <SelectItem value="MCA">MCA</SelectItem>
                        <SelectItem value="BCA">BCA</SelectItem>
                        <SelectItem value="B.Sc IT">B.Sc IT</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Branch/Stream</Label>
                    <Input 
                      placeholder="e.g. Computer Science" 
                      required 
                      value={form.branch}
                      onChange={e => setForm({...form, branch: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>College Name</Label>
                    <Input 
                      placeholder="e.g. Oxford University" 
                      required 
                      value={form.collegeName}
                      onChange={e => setForm({...form, collegeName: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Semester</Label>
                    <Input 
                      placeholder="e.g. 7th" 
                      required 
                      value={form.semester}
                      onChange={e => setForm({...form, semester: e.target.value})}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Internship Details Section */}
            <Card className="border-none shadow-sm">
              <CardHeader className="bg-primary/5 border-b border-primary/10">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-primary" />
                  <CardTitle className="text-lg">Internship Details</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="space-y-2">
                  <Label>Internship Domain</Label>
                  <Select value={form.internshipDomain} onValueChange={v => setForm({...form, internshipDomain: v})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Software Development">Software Development</SelectItem>
                      <SelectItem value="Web Development">Web Development</SelectItem>
                      <SelectItem value="Data Science">Data Science</SelectItem>
                      <SelectItem value="Mobile App Development">Mobile App Development</SelectItem>
                      <SelectItem value="Digital Marketing">Digital Marketing</SelectItem>
                      <SelectItem value="UI/UX Design">UI/UX Design</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Start Date</Label>
                    <Input 
                      type="date" 
                      required 
                      value={form.startDate}
                      onChange={e => setForm({...form, startDate: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>End Date</Label>
                    <Input 
                      type="date" 
                      required 
                      value={form.endDate}
                      onChange={e => setForm({...form, endDate: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Issue Date</Label>
                    <Input
                      type="date"
                      required
                      value={form.issueDate}
                      onChange={e => setForm({...form, issueDate: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Total Hours Reported</Label>
                    <Input 
                      type="number" 
                      placeholder="e.g. 320" 
                      required 
                      value={form.totalHours}
                      onChange={e => setForm({...form, totalHours: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Performance</Label>
                    <Select value={form.performance} onValueChange={(v: any) => setForm({...form, performance: v})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Excellent">Excellent</SelectItem>
                        <SelectItem value="Very Good">Very Good</SelectItem>
                        <SelectItem value="Good">Good</SelectItem>
                        <SelectItem value="Average">Average</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* AI Audit Trigger */}
              </CardContent>
            </Card>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Button size="lg" className="flex-1 h-14 text-lg font-bold gap-2" type="submit" disabled={loading}>
              <Save className="w-5 h-5" />
              {loading ? 'Generating...' : 'Issue Certificate'}
            </Button>
            <Button size="lg" variant="outline" className="h-14 text-lg font-bold gap-2" type="reset" onClick={() => setForm({
              studentName: '',
              fatherName: '',
              courseName: 'B.Tech',
              collegeName: '',
              branch: '',
              semester: '1st',
              internshipDomain: 'Software Development',
              startDate: '',
              endDate: '',
              totalHours: '',
              performance: 'Excellent',
              authorizedSignatory: 'Director, Eunous IT',
              gender: 'Male',
              studentRoll: '',
              issueDate: new Date().toISOString().split('T')[0],
            })}>
              <RotateCcw className="w-5 h-5" />
              Reset Form
            </Button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}
