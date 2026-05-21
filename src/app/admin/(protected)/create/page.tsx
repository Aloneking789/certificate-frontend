"use client"
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { User, BookOpen, Save, RotateCcw } from 'lucide-react';
import { flagInconsistentCertificateData } from '@/ai/flows/flag-inconsistent-certificate-data';

export default function CreateCertificatePage() {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    studentName: '',
    fatherName: '',
    courseName: 'B.Tech',
    collegeName: '',
    branch: '',
    semester: '1st',
    internshipDomain: '',
    startDate: '',
    endDate: '',
    totalHours: '',
    performance: 'Excellent' as const,
    authorizedSignatory: 'Director, Eunous IT',
    gender: 'Male',
    studentRoll: '',
    issueDate: new Date().toISOString().split('T')[0],
  });

  const [courses, setCourses] = useState<Array<{ id: number; name: string }>>([]);
  const [branches, setBranches] = useState<Array<{ id: number; name: string }>>([]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await fetch('/api/courses');
        const payload = await res.json();
        if (res.ok && payload?.data && mounted) setCourses(payload.data);
      } catch (e) {
        // ignore
      }
    })();
    return () => { mounted = false };
  }, []);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await fetch('/api/branches');
        const payload = await res.json();
        if (res.ok && payload?.data && mounted) setBranches(payload.data);
      } catch (e) {
        // ignore
      }
    })();
    return () => { mounted = false };
  }, []);

  const internshipOptions = Array.from(new Set(branches.map(b => b.name).filter(Boolean)));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload: any = {
        fullName: form.studentName,
        fatherName: form.fatherName,
        gender: form.gender,
        studentRoll: form.studentRoll,
        courseName: form.courseName,
        collegeName: form.collegeName,
        ...(form.branch ? { branch: form.branch } : {}),
        semester: form.semester,
        internshipDomain: form.internshipDomain,
        startDate: form.startDate,
        endDate: form.endDate,
        totalHours: parseInt(form.totalHours || '0'),
        performance: form.performance,
        authorizedSignatory: form.authorizedSignatory,
        issueDate: form.issueDate,
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

      if (res.ok) {
        const certNum = data?.certificate?.certificateNumber || data?.registrationNumber || data?.certificate?.registrationNumber || data?.data?.registrationNumber;
        const display = certNum || `EUNOUS-REG-${Date.now()}`;
        toast({ title: 'Certificate Generated', description: `Issued ${display}` });
        router.push(`/certificate/${display}`);
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
                    <Input placeholder="e.g. John Doe" required value={form.studentName} onChange={e => setForm({ ...form, studentName: e.target.value })} />
                  </div>

                  <div className="space-y-2 col-span-2">
                    <Label>Father's Name</Label>
                    <Input placeholder="e.g. Richard Doe" required value={form.fatherName} onChange={e => setForm({ ...form, fatherName: e.target.value })} />
                  </div>

                  <div className="space-y-2">
                    <Label>Gender</Label>
                    <Select value={form.gender} onValueChange={v => setForm({ ...form, gender: v })}>
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
                    <Input placeholder="e.g. CS2026-001" value={form.studentRoll} onChange={e => setForm({ ...form, studentRoll: e.target.value })} />
                  </div>

                  <div className="space-y-2">
                    <Label>Course Name</Label>
                    <Select value={form.courseName} onValueChange={v => setForm({ ...form, courseName: v })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {courses.length ? courses.map(c => <SelectItem key={c.id} value={c.name}>{c.name}</SelectItem>) : (
                          <>
                            <SelectItem value="B.Tech">B.Tech</SelectItem>
                            <SelectItem value="M.Tech">M.Tech</SelectItem>
                          </>
                        )}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Branch/Stream <span className="text-sm text-muted-foreground">(optional)</span></Label>
                    <Input placeholder="e.g. Computer Science" value={form.branch} onChange={e => setForm({ ...form, branch: e.target.value })} />
                  </div>

                  <div className="space-y-2">
                    <Label>College Name</Label>
                    <Input placeholder="e.g. Oxford University" required value={form.collegeName} onChange={e => setForm({ ...form, collegeName: e.target.value })} />
                  </div>

                  <div className="space-y-2">
                    <Label>Semester</Label>
                    <Input placeholder="e.g. 7th" required value={form.semester} onChange={e => setForm({ ...form, semester: e.target.value })} />
                  </div>
                </div>
              </CardContent>
            </Card>

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
                  <Select value={form.internshipDomain} onValueChange={v => setForm({ ...form, internshipDomain: v })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {internshipOptions.length ? internshipOptions.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>) : <SelectItem value="__no_options" disabled>No domains available</SelectItem>}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Start Date</Label>
                    <Input type="date" required value={form.startDate} onChange={e => setForm({ ...form, startDate: e.target.value })} />
                  </div>

                  <div className="space-y-2">
                    <Label>End Date</Label>
                    <Input type="date" required value={form.endDate} onChange={e => setForm({ ...form, endDate: e.target.value })} />
                  </div>

                  <div className="space-y-2">
                    <Label>Issue Date</Label>
                    <Input type="date" required value={form.issueDate} onChange={e => setForm({ ...form, issueDate: e.target.value })} />
                  </div>

                  <div className="space-y-2">
                    <Label>Total Hours Reported</Label>
                    <Input type="number" placeholder="e.g. 320" required value={form.totalHours} onChange={e => setForm({ ...form, totalHours: e.target.value })} />
                  </div>

                  <div className="space-y-2">
                    <Label>Performance</Label>
                    <Select value={form.performance} onValueChange={(v: any) => setForm({ ...form, performance: v })}>
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
              </CardContent>
            </Card>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Button size="lg" className="flex-1 h-14 text-lg font-bold gap-2" type="submit" disabled={loading}>
              <Save className="w-5 h-5" />
              {loading ? 'Generating...' : 'Issue Certificate'}
            </Button>
            <Button size="lg" variant="outline" className="h-14 text-lg font-bold gap-2" type="reset" onClick={() => setForm({
              studentName: '', fatherName: '', courseName: 'B.Tech', collegeName: '', branch: '', semester: '1st', internshipDomain: '', startDate: '', endDate: '', totalHours: '', performance: 'Excellent', authorizedSignatory: 'Director, Eunous IT', gender: 'Male', studentRoll: '', issueDate: new Date().toISOString().split('T')[0]
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
