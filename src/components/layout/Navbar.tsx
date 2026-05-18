"use client"
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ShieldCheck, LogIn } from 'lucide-react';

export function Navbar() {
  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-md">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <ShieldCheck className="w-8 h-8 text-primary" />
          <span className="font-headline font-bold text-xl tracking-tight text-primary">
            Eunous <span className="text-accent">CertiFlow</span>
          </span>
        </Link>
        
        <div className="hidden md:flex items-center gap-6">
          <Link href="/verify" className="text-sm font-medium hover:text-primary transition-colors">
            Verify Certificate
          </Link>
          <Link href="/admin/login">
            <Button variant="outline" size="sm" className="gap-2">
              <LogIn className="w-4 h-4" />
              Admin Login
            </Button>
          </Link>
        </div>
      </div>
    </nav>
  );
}
