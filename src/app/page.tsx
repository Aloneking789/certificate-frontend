
"use client"
import Link from 'next/link';
import Image from 'next/image';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Navbar } from '@/components/layout/Navbar';
import { 
  ShieldCheck, 
  Search, 
  Award, 
  FileCheck, 
  ArrowRight, 
  ChevronRight, 
  Users, 
  Zap, 
  Lock, 
  Fingerprint,
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card, CardContent } from '@/components/ui/card';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    try {
      const match = document.cookie.match(/certiflow_token=([^;]+)/);
      if (match && match[1]) {
        // If admin token exists, send user to admin dashboard instead of public homepage
        router.replace('/admin/dashboard');
      }
    } catch (e) {
      // ignore
    }
  }, [router]);

  const heroImg = PlaceHolderImages.find(img => img.id === 'hero-bg')?.imageUrl;
  const studentImg = "https://plus.unsplash.com/premium_photo-1661751188825-710ec341b907?q=80&w=2069&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";
  const securityImg = PlaceHolderImages.find(img => img.id === 'security-tech')?.imageUrl;
  const teamImg = PlaceHolderImages.find(img => img.id === 'collaboration')?.imageUrl;
  const certImg = PlaceHolderImages.find(img => img.id === 'certificate-closeup')?.imageUrl;

  const testimonials = [
    {
      name: "Ananya Iyer",
      role: "Software Intern at Google",
      content: "CertiFlow made my background verification seamless. The HR team was impressed by the instant QR verification.",
      avatar: "https://picsum.photos/seed/avatar1/100/100"
    },
    {
      name: "Vikram Malhotra",
      role: "Full Stack Developer",
      content: "The certificate quality is top-notch. It looks professional on my LinkedIn and is easily verifiable by anyone.",
      avatar: "https://picsum.photos/seed/avatar2/100/100"
    },
    {
      name: "Sarah Chen",
      role: "Product Manager",
      content: "Finally, a system that treats internship credentials with the security and professional polish they deserve.",
      avatar: "https://picsum.photos/seed/avatar3/100/100"
    }
  ];

  return (
    <div className="min-h-screen flex flex-col selection:bg-accent selection:text-white">
      <Navbar />
      
      <main className="flex-1">
        {/* Modern Hero Section */}
        <section className="relative min-h-[90vh] flex items-center pt-16 overflow-hidden">
          <div className="absolute inset-0 z-0">
            {heroImg && (
              <div className="relative w-full h-full">
                <Image 
                  src={heroImg} 
                  alt="Modern Office" 
                  fill 
                  className="object-cover opacity-20"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-b from-background via-background/80 to-background" />
              </div>
            )}
          </div>
          
          <div className="container mx-auto px-4 relative z-10">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-8 text-center lg:text-left">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/5 border border-primary/10 text-primary text-sm font-bold animate-in fade-in slide-in-from-bottom-4 duration-700">
                  <Sparkles className="w-4 h-4 text-accent" />
                  Redefining Digital Credentials
                </div>
                <h1 className="text-6xl lg:text-8xl font-headline font-bold text-primary leading-[1.1] tracking-tight animate-in fade-in slide-in-from-bottom-6 duration-1000">
                  Trust but <br />
                  <span className="text-accent underline decoration-accent/20 underline-offset-8">Verify</span>
                </h1>
                <p className="text-xl text-muted-foreground max-w-xl mx-auto lg:mx-0 leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-1000">
                  Eunous CertiFlow provides a high-security, professional ecosystem for issuing and authenticating internship achievements with absolute confidence.
                </p>
                <div className="flex flex-wrap justify-center lg:justify-start gap-4 animate-in fade-in slide-in-from-bottom-10 duration-1000">
                  <Link href="/verify">
                    <Button size="lg" className="h-16 px-10 text-lg font-bold gap-3 rounded-2xl shadow-xl shadow-primary/20 hover:scale-105 transition-transform">
                      <Search className="w-5 h-5" />
                      Verify a Record
                    </Button>
                  </Link>
                  <Link href="/admin/login">
                    <Button variant="outline" size="lg" className="h-16 px-10 text-lg font-bold gap-2 rounded-2xl border-2 hover:bg-secondary/50">
                      Issuer Portal
                      <ChevronRight className="w-5 h-5" />
                    </Button>
                  </Link>
                </div>
              </div>
              
              <div className="relative hidden lg:block group">
                <div className="absolute -inset-4 bg-gradient-to-tr from-accent/30 to-primary/30 blur-3xl opacity-50 group-hover:opacity-100 transition-opacity duration-1000" />
                <div className="relative bg-white/40 backdrop-blur-xl border border-white/60 p-4 rounded-[2.5rem] shadow-2xl overflow-hidden">
                  <div className="relative aspect-[4/3] rounded-[2rem] overflow-hidden">
                    {studentImg && (
                      <Image 
                        src={studentImg} 
                        alt="Success" 
                        fill 
                        className="object-cover hover:scale-105 transition-transform duration-700"
                        data-ai-hint="professional student"
                      />
                    )}
                    <div className="absolute bottom-6 left-6 right-6 p-6 bg-white/90 backdrop-blur-md rounded-2xl shadow-lg border border-white/50 animate-in fade-in slide-in-from-bottom-10 delay-500 duration-1000">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center text-white">
                          <CheckCircle2 className="w-6 h-6" />
                        </div>
                        <div>
                          <p className="font-bold text-primary">Credential Verified</p>
                          <p className="text-sm text-muted-foreground">EUNOUS-REG-2026-8812</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Bento Grid Features */}
        <section className="py-24 bg-white relative">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-4">
              <div className="max-w-2xl">
                <h2 className="text-4xl md:text-5xl font-headline font-bold text-primary mb-4">Uncompromising Standards</h2>
                <p className="text-xl text-muted-foreground">We've built a multi-layered verification system that ensures every credential represents real achievement.</p>
              </div>
              <div className="flex gap-2 text-primary font-bold items-center text-sm uppercase tracking-widest">
                <span>View Features</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-6 gap-6">
              {/* Feature 1: Bento Big */}
              <div className="md:col-span-4 lg:col-span-3 row-span-2 group relative overflow-hidden bg-primary rounded-[2.5rem] p-10 text-white shadow-2xl hover:shadow-primary/20 transition-all">
                <div className="relative z-10 flex flex-col h-full justify-between">
                  <div>
                    <div className="w-14 h-14 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center mb-8 border border-white/10 group-hover:scale-110 transition-transform">
                      <Lock className="w-7 h-7 text-accent" />
                    </div>
                    <h3 className="text-3xl font-bold mb-4">Tamper-Proof Verification</h3>
                    <p className="text-lg text-white/70 leading-relaxed">Each certificate is cryptographically signed and stored with a unique fingerprint, making unauthorized modifications virtually impossible.</p>
                  </div>
                  <div className="mt-8 flex gap-3">
                    <span className="px-4 py-1.5 rounded-full bg-white/10 text-xs font-bold uppercase tracking-widest">Blockchain Ready</span>
                    <span className="px-4 py-1.5 rounded-full bg-white/10 text-xs font-bold uppercase tracking-widest">Secure Cloud</span>
                  </div>
                </div>
                {securityImg && (
                  <Image 
                    src={securityImg} 
                    alt="Security" 
                    fill 
                    className="object-cover absolute inset-0 opacity-20 group-hover:opacity-30 group-hover:scale-105 transition-all duration-700"
                  />
                )}
              </div>

              {/* Feature 2: Bento Medium */}
              <div className="md:col-span-2 lg:col-span-3 group relative overflow-hidden bg-secondary rounded-[2.5rem] p-8 shadow-md hover:shadow-xl transition-all border border-border/50">
                <div className="flex flex-col md:flex-row gap-6 items-center">
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-primary mb-3">AI Integrity Audit</h3>
                    <p className="text-muted-foreground">Automated cross-referencing of internship hours against domain standards to flag data inconsistencies before issuance.</p>
                  </div>
                  <div className="w-24 h-24 bg-accent/10 rounded-3xl flex items-center justify-center group-hover:rotate-12 transition-transform">
                    <Zap className="w-10 h-10 text-accent" />
                  </div>
                </div>
              </div>

              {/* Feature 3: Bento Small */}
              <div className="md:col-span-2 group bg-white rounded-[2.5rem] p-8 border-2 border-dashed border-border/50 hover:border-accent transition-colors flex flex-col justify-center text-center">
                <Users className="w-10 h-10 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-bold text-primary mb-2">Recruiter Trusted</h3>
                <p className="text-sm text-muted-foreground italic">"The easiest verification portal we've ever used."</p>
              </div>

              {/* Feature 4: Bento Medium Image */}
              <div className="md:col-span-2 lg:col-span-3 group relative overflow-hidden bg-accent rounded-[2.5rem] p-8 text-white shadow-xl">
                <div className="relative z-10">
                  <h3 className="text-2xl font-bold mb-2">High-Fidelity Rendering</h3>
                  <p className="text-white/80">Beautiful, print-ready certificates designed for professional display.</p>
                </div>
                {certImg && (
                  <Image 
                    src={certImg} 
                    alt="Certificate" 
                    fill 
                    className="object-cover absolute inset-0 opacity-40 group-hover:scale-110 transition-transform duration-1000"
                  />
                )}
              </div>

              {/* Feature 5: Bento Small Icons */}
              <div className="md:col-span-2 group bg-secondary/50 rounded-[2.5rem] p-8 flex flex-col items-center justify-center gap-4">
                <div className="flex -space-x-3">
                  {[1,2,3,4].map(i => (
                    <div key={i} className="w-12 h-12 rounded-full border-4 border-white bg-primary flex items-center justify-center overflow-hidden">
                      <Image src={`https://picsum.photos/seed/user${i}/100/100`} alt="user" width={48} height={48} />
                    </div>
                  ))}
                </div>
                <p className="text-sm font-bold text-primary">+5,000 Verified Interns</p>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonial Carousel */}
        <section className="py-24 bg-primary overflow-hidden">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-headline font-bold text-white mb-6">Student Success Stories</h2>
              <p className="text-xl text-white/60 max-w-2xl mx-auto">See how CertiFlow is helping the next generation of professionals build credible careers.</p>
            </div>

            <div className="max-w-5xl mx-auto px-12">
              <Carousel className="w-full" opts={{ loop: true }}>
                <CarouselContent>
                  {testimonials.map((t, index) => (
                    <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/1">
                      <div className="p-4">
                        <Card className="bg-white/5 border-white/10 backdrop-blur-md rounded-[2.5rem] p-8 md:p-12 overflow-hidden relative">
                          <div className="absolute top-0 right-0 w-32 h-32 bg-accent/10 rounded-bl-full" />
                          <CardContent className="p-0 space-y-8">
                            <p className="text-2xl md:text-3xl font-medium text-white leading-relaxed">"{t.content}"</p>
                            <div className="flex items-center gap-4">
                              <div className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-accent">
                                <Image src={t.avatar} alt={t.name} width={64} height={64} className="object-cover" />
                              </div>
                              <div>
                                <h4 className="text-xl font-bold text-white">{t.name}</h4>
                                <p className="text-accent font-medium">{t.role}</p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <div className="hidden md:block">
                  <CarouselPrevious className="bg-white/10 text-white border-white/20 hover:bg-white/20 -left-16" />
                  <CarouselNext className="bg-white/10 text-white border-white/20 hover:bg-white/20 -right-16" />
                </div>
              </Carousel>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-24 bg-white">
          <div className="container mx-auto px-4">
            <div className="bg-accent rounded-[3rem] p-12 md:p-24 text-center text-white relative overflow-hidden group shadow-2xl shadow-accent/20">
              <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/10 via-transparent to-transparent opacity-50" />
              <div className="relative z-10 max-w-3xl mx-auto space-y-8">
                <Fingerprint className="w-16 h-16 mx-auto animate-pulse" />
                <h2 className="text-4xl md:text-6xl font-headline font-bold">Ready to secure your credentials?</h2>
                <p className="text-xl md:text-2xl text-white/80">Whether you're an institution looking to issue or a student looking to verify, we've got you covered.</p>
                <div className="flex flex-wrap justify-center gap-4 pt-4">
                  <Link href="/verify">
                    <Button size="lg" className="h-16 px-10 text-lg font-bold bg-white text-accent hover:bg-white/90 rounded-2xl">
                      Get Started Now
                    </Button>
                  </Link>
                  <Button variant="outline" size="lg" className="h-16 px-10 text-lg font-bold bg-transparent border-white/40 text-white hover:bg-white/10 rounded-2xl">
                    Contact Sales
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-primary text-white py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-12 mb-16">
            <div className="md:col-span-2 space-y-6">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-10 h-10 text-accent" />
                <span className="font-headline font-bold text-3xl tracking-tight">
                  Eunous <span className="text-accent">CertiFlow</span>
                </span>
              </div>
              <p className="text-white/60 text-lg max-w-sm">
                Establishing the global standard for secure internship credentialing and instant professional verification.
              </p>
            </div>
            <div>
              <h4 className="font-bold text-xl mb-6">Platform</h4>
              <ul className="space-y-4 text-white/60">
                <li><Link href="/verify" className="hover:text-accent transition-colors">Verification Portal</Link></li>
                <li><Link href="/admin/login" className="hover:text-accent transition-colors">Admin Dashboard</Link></li>
                <li><Link href="#" className="hover:text-accent transition-colors">Security Overview</Link></li>
                <li><Link href="#" className="hover:text-accent transition-colors">API Access</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-xl mb-6">Contact</h4>
              <ul className="space-y-4 text-white/60">
                <li>info@euonusit.com</li>
                <li>Support Center</li>
                <li>Documentation</li>
                <li>Privacy Policy</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-white/60">
            <p>© 2026 Eunous IT Private Limited. All rights reserved.</p>
            <div className="flex gap-8">
              <span>Terms of Service</span>
              <span>Cookie Policy</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
