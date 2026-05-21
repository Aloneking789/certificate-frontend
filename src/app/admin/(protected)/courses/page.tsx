"use client"
import { useEffect, useState } from 'react';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';

export default function CoursesPage() {
  const { toast } = useToast();
  const [courses, setCourses] = useState<Array<{ id: number; name: string; description?: string }>>([]);
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    let mounted = true;
    (async function fetchCourses() {
      setLoading(true);
      try {
        const res = await fetch('/api/courses');
        const payload = await res.json();
        if (res.ok && payload?.data) {
          if (mounted) setCourses(payload.data);
        }
      } catch (err) {
        // ignore
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false };
  }, []);

  const handleCreate = async () => {
    if (!name) return;
    setCreating(true);
    try {
      const res = await fetch('/api/courses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json',
           

         },
        body: JSON.stringify({ name, description }),
      });
      const payload = await res.json();
      if (res.ok && payload?.data) {
        setCourses(prev => [payload.data, ...prev]);
        setName('');
        setDescription('');
        toast({ title: 'Course Created', description: `Created ${payload.data.name}` });
      } else {
        toast({ title: 'Create Failed', description: payload?.message || 'Unable to create course', variant: 'destructive' });
      }
    } catch (err) {
      toast({ title: 'Network Error', description: 'Could not create course', variant: 'destructive' });
    } finally {
      setCreating(false);
    }
  };

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Courses</h1>
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Create new course</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-3">
              <Input placeholder="Course name" value={name} onChange={e => setName(e.target.value)} />
              <Input placeholder="Short description" value={description} onChange={e => setDescription(e.target.value)} />
              <div className="flex gap-2">
                <Button disabled={creating || !name} onClick={handleCreate}>Create Course</Button>
                <Button variant="outline" onClick={() => { setName(''); setDescription(''); }}>Clear</Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Available courses (fetched from backend)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-3">
              {loading ? (
                <div>Loading courses...</div>
              ) : courses.length ? (
                courses.map(c => (
                  <div key={c.id} className="p-3 border rounded flex items-center justify-between">
                    <div>
                      <div className="font-medium">{c.name}</div>
                      <div className="text-sm text-muted-foreground">{c.description}</div>
                    </div>
                    <div className="flex gap-2">
                      <Link href={`/admin/create?course=${encodeURIComponent(c.name)}`}>
                        <Button size="sm" variant="ghost">Use</Button>
                      </Link>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-sm text-muted-foreground">No courses available.</div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
