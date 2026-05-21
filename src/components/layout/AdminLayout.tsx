"use client"
import { SidebarProvider, Sidebar, SidebarContent, SidebarHeader, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarFooter, SidebarTrigger, SidebarInset } from '@/components/ui/sidebar';
import { ShieldCheck, LayoutDashboard, FileText, PlusCircle, LogOut, Bell, User, Building, BookOpen } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    fetch('/api/auth/logout', { method: 'POST' }).then(() => {
      router.push('/admin/login');
    }).catch(() => router.push('/admin/login'));
  };

  const menuItems = [
    { title: 'Dashboard', icon: LayoutDashboard, href: '/admin/dashboard' },
    { title: 'All Certificates', icon: FileText, href: '/admin/certificates' },
    { title: 'Courses', icon: BookOpen, href: '/admin/courses' },
    { title: 'Branches', icon: Building, href: '/admin/branches' },
    { title: 'Create New', icon: PlusCircle, href: '/admin/create' },
  ];

  return (
    <SidebarProvider>
      <Sidebar collapsible="icon" className="border-r border-white/10">
        <SidebarHeader className="p-4">
          <Link href="/" className="flex items-center gap-2 px-2 overflow-hidden">
            <ShieldCheck className="w-8 h-8 text-accent shrink-0" />
            <span className="font-headline font-bold text-xl text-white whitespace-nowrap group-data-[collapsible=icon]:hidden">
              Certi<span className="text-accent">Flow</span>
            </span>
          </Link>
        </SidebarHeader>
        <SidebarContent className="p-2 pt-8">
          <SidebarMenu>
            {menuItems.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton 
                  asChild 
                  isActive={pathname === item.href}
                  tooltip={item.title}
                  className="h-12"
                >
                  <Link href={item.href}>
                    <item.icon className="w-5 h-5" />
                    <span className="font-medium">{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter className="p-4 border-t border-white/5">
          <SidebarMenuButton onClick={handleLogout} className="h-12 hover:bg-destructive/10 hover:text-destructive">
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Sign Out</span>
          </SidebarMenuButton>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b bg-white px-4 md:px-8 shadow-sm">
          <div className="flex items-center gap-4">
            <SidebarTrigger />
            <div className="h-4 w-px bg-border" />
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
              {menuItems.find(m => m.href === pathname)?.title || 'Admin Panel'}
            </h2>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-accent rounded-full border-2 border-white" />
            </Button>
            <div className="h-8 w-8 bg-primary rounded-full flex items-center justify-center text-white">
              <User className="w-4 h-4" />
            </div>
          </div>
        </header>
        <main className="flex-1 p-4 md:p-8">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
