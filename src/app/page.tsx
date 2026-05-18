"use client"
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Navbar } from '@/components/layout/Navbar';
import { ShieldCheck, Search, Award, FileCheck, ArrowRight } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative py-24 overflow-hidden bg-white">
          <div className="absolute top-0 right-0 w-1/2 h-full bg-secondary/50 -skew-x-12 translate-x-24 z-0 hidden lg:block" />
          
          <div className="container mx-auto px-4 relative z-10">
            <div className="flex flex-col lg:flex-row items-center gap-12">
              <div className="flex-1 text-center lg:text-left">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 text-accent text-sm font-bold mb-6">
                  <ShieldCheck className="w-4 h-4" />
                  Secured by Blockchain-Ready QR
                </div>
                <h1 className="text-5xl lg:text-7xl font-headline font-bold text-primary leading-tight mb-6">
                  Internship Certificate <br />
                  <span className="text-accent">Verification System</span>
                </h1>
                <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto lg:mx-0">
                  Powered by Eunous IT. A professional, high-fidelity system for generating and authenticating internship credentials instantly.
                </p>
                <div className="flex flex-wrap justify-center lg:justify-start gap-4">
                  <Link href="/verify">
                    <Button size="lg" className="h-14 px-8 text-lg font-bold gap-2 rounded-full">
                      <Search className="w-5 h-5" />
                      Verify Certificate
                    </Button>
                  </Link>
                  <Link href="/admin/login">
                    <Button variant="outline" size="lg" className="h-14 px-8 text-lg font-bold gap-2 rounded-full">
                      Admin Portal
                      <ArrowRight className="w-5 h-5" />
                    </Button>
                  </Link>
                </div>
              </div>
              
              <div className="flex-1 w-full max-w-xl">
                <div className="relative p-2 bg-gradient-to-tr from-primary to-accent rounded-2xl shadow-2xl rotate-2">
                  <div className="bg-white rounded-xl p-8 shadow-inner overflow-hidden flex flex-col items-center">
                    <Award className="w-16 h-16 text-accent mb-4" />
                    <div className="w-full h-4 bg-secondary rounded-full mb-4 animate-pulse" />
                    <div className="w-3/4 h-4 bg-secondary rounded-full mb-8 animate-pulse" />
                    <div className="grid grid-cols-2 gap-4 w-full">
                      <div className="h-20 bg-secondary/50 rounded-lg flex items-center justify-center">
                        <FileCheck className="w-8 h-8 text-primary/30" />
                      </div>
                      <div className="h-20 bg-secondary/50 rounded-lg" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-24 bg-secondary/30">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl md:text-4xl font-headline font-bold text-primary mb-4">Why Eunous CertiFlow?</h2>
              <p className="text-muted-foreground">The gold standard in internship credentialing, ensuring trust and transparency for students and employers alike.</p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  title: "Instant Verification",
                  desc: "Recruiters can verify student credentials in seconds using a simple registration number or QR code scan.",
                  icon: Search
                },
                {
                  title: "High Fidelity Design",
                  desc: "Every certificate is rendered with professional-grade typography and branding, ready for printing and framing.",
                  icon: Award
                },
                {
                  title: "AI-Powered Audits",
                  desc: "Our intelligent engine cross-references internship hours and domains to ensure data consistency.",
                  icon: ShieldCheck
                }
              ].map((feature, i) => (
                <div key={i} className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow border border-border/50">
                  <div className="w-12 h-12 bg-primary/5 rounded-xl flex items-center justify-center mb-6">
                    <feature.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold text-primary mb-3">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-primary text-white py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8 mb-8">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-8 h-8 text-accent" />
              <span className="font-headline font-bold text-2xl tracking-tight">
                Eunous <span className="text-accent">CertiFlow</span>
              </span>
            </div>
            <div className="flex gap-8 text-sm font-medium">
              <Link href="/verify" className="hover:text-accent transition-colors">Verify</Link>
              <Link href="/admin/login" className="hover:text-accent transition-colors">Admin</Link>
              <a href="mailto:info@eunousit.com" className="hover:text-accent transition-colors">Contact</a>
            </div>
          </div>
          <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-white/60">
            <p>© 2026 Eunous IT. All rights reserved.</p>
            <p>Designed for professional internship management.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
