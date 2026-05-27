"use client"
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { ShieldCheck, Lock, Mail, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ email: '', password: '' });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        router.push('/admin/dashboard');
      } else {
        toast({
          variant: 'destructive',
          title: 'Login Failed',
          description: data?.message || 'Invalid email or password.',
        });
      }
    } catch (err) {
      toast({
        variant: 'destructive',
        title: 'Network Error',
        description: 'Unable to contact authentication server.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      <div className="hidden lg:flex flex-1 bg-primary text-white p-12 flex-col justify-between relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent" />
        <div className="relative z-10">
          <Link href="/" className="flex items-center gap-2 mb-12">
            <ShieldCheck className="w-8 h-8 text-accent" />
            <span className="font-headline font-bold text-2xl tracking-tight">Eunous <span className="text-accent">CertiFlow</span></span>
          </Link>
          <h1 className="text-5xl font-headline font-bold mb-6">Secure Command Center</h1>
          <p className="text-xl text-white/70 max-w-md">Manage your internship credentials with high security and AI-powered auditing tools.</p>
        </div>
        <div className="relative z-10 text-white/50 text-sm italic">
          Powering professional certification workflows since 2024.
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-4 bg-background">
        <div className="w-full max-w-md space-y-8">
          <div className="lg:hidden text-center mb-8">
            <ShieldCheck className="w-12 h-12 text-primary mx-auto mb-2" />
            <h2 className="text-3xl font-headline font-bold text-primary">CertiFlow Admin</h2>
          </div>

          <Card className="border-none shadow-2xl">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-bold">Sign In</CardTitle>
              <CardDescription>Enter your administrative credentials</CardDescription>
            </CardHeader>
            <form onSubmit={handleLogin}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input 
                      id="email" 
                      type="email" 
                      placeholder="admin@euonusit.com" 
                      className="pl-10"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      required 
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Password</Label>
                    <Button variant="link" className="p-0 h-auto text-xs">Forgot password?</Button>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input 
                      id="password" 
                      type="password" 
                      placeholder="••••••••" 
                      className="pl-10"
                      value={form.password}
                      onChange={(e) => setForm({ ...form, password: e.target.value })}
                      required 
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col gap-4">
                <Button className="w-full h-12 text-lg font-bold" type="submit" disabled={loading}>
                  {loading ? 'Authenticating...' : 'Access Dashboard'}
                </Button>
                <Link href="/" className="w-full">
                  <Button variant="outline" className="w-full h-10 gap-2">
                    <ArrowLeft className="w-4 h-4" />
                    Back to Website
                  </Button>
                </Link>
              </CardFooter>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
}
