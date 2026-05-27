"use client"
import { useEffect, useState } from 'react';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

export default function BranchesPage() {
  const { toast } = useToast();
  const [branches, setBranches] = useState<Array<{ id: number; name: string; description?: string }>>([]);
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    let mounted = true;
    (async function fetch() {
      setLoading(true);
      try {
        const res = await fetch('/api/branches');
        const payload = await res.json();
        if (res.ok && payload?.data) {
          if (mounted) setBranches(payload.data);
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
      const res = await fetch('/api/branches', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, description }),
      });
      const payload = await res.json();
      if (res.ok && payload?.data) {
        setBranches(prev => [payload.data, ...prev]);
        setName('');
        setDescription('');
        toast({ title: 'Branch Created', description: `Created ${payload.data.name}` });
      } else {
        toast({ title: 'Create Failed', description: payload?.message || 'Unable to create branch', variant: 'destructive' });
      }
    } catch (err) {
      toast({ title: 'Network Error', description: 'Could not create branch', variant: 'destructive' });
    } finally {
      setCreating(false);
    }
  };

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Branches</h1>
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Create New Branch</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-3">
              <Input placeholder="Branch name" value={name} onChange={e => setName(e.target.value)} />
              <Input placeholder="Short description" value={description} onChange={e => setDescription(e.target.value)} />
              <div className="flex gap-2">
                <Button disabled={creating || !name} onClick={handleCreate}>Create Branch</Button>
                <Button variant="outline" onClick={() => { setName(''); setDescription(''); }}>Clear</Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Available Branches</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-3">
              {loading ? (
                <div>Loading branches...</div>
              ) : branches.length ? (
                branches.map(b => (
                  <div key={b.id} className="p-3 border rounded flex items-center justify-between">
                    <div>
                      <div className="font-medium">{b.name}</div>
                      <div className="text-sm text-muted-foreground">{b.description}</div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-sm text-muted-foreground">No branches available.</div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
